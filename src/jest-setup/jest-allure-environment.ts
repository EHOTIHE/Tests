/* eslint-disable no-case-declarations */
import RootEnv from 'jest-environment-node'
import AllureReporter from 'jest-allure-circus/dist/allure-reporter'
import {AllureConfig, AllureRuntime, ContentType} from 'allure-js-commons'
import path from 'path'
import fs from 'fs'

import type {EnvironmentContext, JestEnvironmentConfig} from '@jest/environment'
import type {Circus} from '@jest/types'
import type {JestAllureInterface} from 'jest-allure-circus'
import {BrowserService} from '../services/browser.service'

function initializeAllureReporter(): AllureReporter {
	const allureConfig: AllureConfig = {
		resultsDir: path.resolve('allure-results'),
	}
	return new AllureReporter({
		allureRuntime: new AllureRuntime(allureConfig),
		labels: [],
		addCodeInReport: false,
	})
}

class CustomEnvironment extends RootEnv {
	private reporter: AllureReporter
	private testPath: string
	private testFileName: string
	// make browser service and allure reporter available globally
	global: RootEnv['global'] & {
		browserService: BrowserService
		allure: JestAllureInterface
	} = this.global

	constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
		super(config, context)
		this.reporter = initializeAllureReporter()
		this.testPath = context.testPath
		this.testFileName = path.basename(this.testPath)
		// instantiate browser service and allure reporter
		this.global.browserService = new BrowserService()
		this.global.allure = this.reporter.getImplementation()
	}

	async setup(): Promise<void> {
		await super.setup()
	}

	async teardown(): Promise<void> {
		await super.teardown()
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async handleTestEvent(event: Circus.AsyncEvent | Circus.SyncEvent, state: Circus.State): Promise<void> {
		switch (event.name) {
			case 'setup':
				break
			case 'add_hook':
				break
			case 'add_test':
				break
			case 'run_start':
				this.reporter.startTestFile(this.testFileName)
				break
			case 'test_skip':
				this.reporter.pendingTestCase(event.test)
				break
			case 'test_todo':
				event.test.mode = event.test.mode || 'todo'
				this.reporter.pendingTestCase(event.test)
				break
			case 'start_describe_definition':
				break
			case 'finish_describe_definition':
				break
			case 'run_describe_start':
				this.reporter.startSuite(event.describeBlock.name)
				break
			case 'test_start':
				this.reporter.startTestCase(event.test, state, this.testPath)

				this.global.browserService.initTest(`${event.test.parent.name} ${event.test.name}`, this.testPath)
				break
			case 'hook_start':
				this.reporter.startHook(event.hook.type)
				break
			case 'hook_success':
				this.reporter.endHook()
				break
			case 'hook_failure':
				this.reporter.endHook(event.error ?? event.hook.asyncError)
				break
			case 'test_fn_start':
				break
			case 'test_fn_success':
				if (event.test.errors.length > 0) {
					this.reporter.failTestCase(event.test.errors[0])
				} else {
					this.reporter.passTestCase()
				}
				break
			case 'test_fn_failure':
				this.reporter.failTestCase(event.test.errors[0])
				break
			case 'test_done':
				let isFailed = false
				const testFullName = this.global.browserService.getTestFullName()
				if (event.test && event.test.parent) {
					this.reporter.currentTest?.addLabel('feature', event.test.parent.name)
				}
				if (event.test && event.test.errors && event.test.errors.length > 0) {
					isFailed = true
					this.reporter.failTestCase(event.test.errors[0])

					// right now we get only the first page of the first context
					const page = this.global.browserService.getPage(0)
					try {
						if (this.reporter.currentTest) {
							const url = page.url()
							const imageBuffer = await page.screenshot({type: 'png', fullPage: false})
							const file = this.reporter.writeAttachment(imageBuffer, ContentType.PNG)
							this.reporter.currentTest.addAttachment(`Test termination screenshot: ${url}`, ContentType.PNG, file)
						}
					} catch (e) {
						console.log(`[Allure error] Failed to attach screenshots for test ${testFullName} with error ${e}`)
					}
				}

				await this.global.browserService.cleanBrowserContext(testFullName, isFailed) // close pages and destroy contexts
				// attach video for failed test
				const outputName = `${testFullName}.webm`
				const attachmentName = `test_execution_video.webm`
				const outputDirPath = path.resolve('outputs')
				const outputFileFullPath = path.join(outputDirPath, outputName)
				if (fs.existsSync(outputFileFullPath) && this.reporter.currentTest) {
					const allureResultFileFullPath = path.resolve('allure-results', outputName)
					fs.renameSync(outputFileFullPath, allureResultFileFullPath)
					this.reporter.currentTest.addAttachment(attachmentName, ContentType.WEBM, allureResultFileFullPath)
				} else {
					console.log(`[Allure error] Failed to attach video for test ${testFullName}`)
				}

				// just an example how to add attachments to the report
				// const content = this.reporter.writeAttachment('test', ContentType.TEXT)
				// this.reporter.currentTest?.addAttachment('test', ContentType.TEXT, content)
				await this.global.browserService.cleanBrowserInstance() // destroy browser instance
				this.reporter.endTest()
				break
			case 'run_describe_finish':
				this.reporter.endSuite()
				break
			case 'run_finish':
				this.reporter.endTestFile()
				break
			case 'teardown':
				break
			case 'error':
				break
			case 'test_retry':
				break
			case 'test_started':
				break
			default:
				console.log('!!!!! UNHANDLED EVENT:', event)
				break
		}
	}
}

module.exports = CustomEnvironment
