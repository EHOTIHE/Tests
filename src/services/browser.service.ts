import path from 'path'

import {
	BrowserType,
	BrowserContext,
	Browser,
	BrowserContextOptions,
	Page,
	chromium,
	webkit,
	firefox,
	ViewportSize,
} from 'playwright'

export type BrowserOptions = {
	browserType?: 'chromium' | 'webkit' | 'firefox'
	headless?: boolean
	viewport?: ViewportSize
}

export class BrowserService {
	private chromiumInstance: BrowserType
	private webkitInstance: BrowserType
	private firefoxInstance: BrowserType
	private browser?: Browser
	private contexts: BrowserContext[] = []
	private testFullName: string
	private testPath: string

	public constructor() {
		this.testFullName = ''
		this.testPath = ''
		this.chromiumInstance = chromium
		this.webkitInstance = webkit
		this.firefoxInstance = firefox
	}

	public initTest(testFullName = '', testPath = ''): void {
		this.testFullName = testFullName
		this.testPath = testPath
	}

	public async setupBrowserContext(browserOptions: BrowserOptions): Promise<BrowserContext> {
		await this.setupBrowserInstance(browserOptions)
		if (this.browser) {
			const contextOptions: BrowserContextOptions = {}

			contextOptions.viewport = browserOptions.viewport || {width: 1000, height: 1000}
			contextOptions.recordVideo = {
				dir: path.resolve('outputs/tmp/'),
			}

			console.log(`[Creating new context]`)
			const context = await this.browser.newContext(contextOptions)

			console.log(`[Creating new page]`)
			await context.newPage()
			this.contexts.push(context)
			return context
		}
		throw new Error('There is no browser instance')
	}

	public async cleanBrowserContext(testName: string, isFailed: boolean): Promise<void> {
		console.log(`[Browser service] Starting context cleanup`)

		const save = isFailed ? true : false
		// Right now we only record video for the first page of the first context
		const page = this.contexts[0] && this.contexts[0].pages() ? this.contexts[0].pages()[0] : undefined
		try {
			if (page && page.video()) {
				if (save) {
					await Promise.all([
						page.video()?.saveAs(path.resolve(`outputs/${testName}.webm`)),
						page.video()?.delete(),
						page.close(),
					])
				} else {
					await Promise.all([page.video()?.delete(), page.close()])
				}
			}
		} catch (e) {
			console.error(`[Browser service] save video recording failed: ${e}`)
		}

		// Close all contexts and pages
		await Promise.all(this.contexts.map(c => c.close()))

		this.contexts = []
		console.log('[Browser service] Context clean done')
	}

	public async cleanBrowserInstance(): Promise<void> {
		if (this.browser) {
			console.log('[Browser service] Starting browser cleanup')
			await this.browser?.close()
			this.browser = undefined
			console.log('[Browser service] Browser cleanup done')
		} else {
			console.log('[Browser service] Skip tear down due to no browser instance found')
		}
	}

	public getTestFullName(): string {
		return this.testFullName.replace(/[^a-zA-Z1-9]/g, '_')
	}

	public getTestPath(): string {
		return this.testPath
	}

	public getBrowser(): Browser {
		if (!this.browser) {
			throw new Error('Browser is not initialized')
		}
		return this.browser
	}

	public getPage(index: number): Page {
		return this.contexts[0].pages()[index]
	}

	private async setupBrowserInstance(browserOptions: BrowserOptions): Promise<void> {
		console.log(`[Launching new browser] ${browserOptions.browserType}`)
		switch (browserOptions.browserType) {
			case 'chromium':
				this.browser = await this.chromiumInstance.launch({headless: browserOptions.headless})
				break
			case 'webkit':
				this.browser = await this.webkitInstance.launch({headless: browserOptions.headless})
				break
			case 'firefox':
				this.browser = await this.firefoxInstance.launch({headless: browserOptions.headless})
				break
			default:
				throw new Error(`Browser ${browserOptions.browserType} not supported`)
		}
		console.log('[Browser service] Browser started')
	}
}
