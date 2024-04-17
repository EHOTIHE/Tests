import {Browser as PlaywrightBrowser, BrowserContext, Page, ViewportSize, ElementHandle} from 'playwright'
import fs from 'fs'
import {DEFAULT_TIMEOUT} from '../utils/constants'

export type BrowserOptions = {
	browserType?: 'chromium' | 'webkit' | 'firefox'
	headless?: boolean
	viewport?: ViewportSize
}

export class Browser {
	private browserOptions: BrowserOptions
	private browser!: PlaywrightBrowser
	private context!: BrowserContext
	private page!: Page
	private currentPageIndex = 0

	public constructor(browserOptions?: BrowserOptions) {
		this.browserOptions = {
			browserType: browserOptions?.browserType || 'chromium',
			// headless: process.env.HEADLESS ? process.env.HEADLESS === 'true',
			headless: browserOptions?.headless || process.env.HEADLESS === 'true',
			viewport: browserOptions?.viewport || {width: 1500, height: 1000},
		}
	}

	public async setup(): Promise<void> {
		// create browser instance, context and 1st page
		this.context = await browserService.setupBrowserContext(this.browserOptions)
		// return current browser
		this.browser = browserService.getBrowser()
		// return current page
		this.page = browserService.getPage(this.currentPageIndex)
	}

	public getPage(): Page {
		return this.page
	}

	// right now not in use, but will be useful if you have several tabs in one browser during the test
	public setCurrentPage(index: number): void {
		this.currentPageIndex = index
		this.page = browserService.getPage(this.currentPageIndex)
	}

	public getContext(): BrowserContext {
		return this.context
	}

	public getBrowser(): PlaywrightBrowser {
		return this.browser
	}

	public async takeScreenshot(selector: string, options: {prefix: string}): Promise<string> {
		if (!this.page) {
			throw new Error('Browser is not initialized')
		}
		let imagePath = 'static/img/placeholder.png'
		try {
			const element = await this.page.waitForSelector(selector, {state: 'visible', timeout: DEFAULT_TIMEOUT})
			const elementBuffer = await element.screenshot()
			imagePath = `outputs/${options.prefix}-screenshot.png`
			fs.writeFileSync(imagePath, elementBuffer)
		} catch (e) {
			console.log(`ignore error ${e}`)
		}
		return imagePath
	}

	public async getElementText(selector: string, options?: {isMandatory?: boolean}): Promise<string> {
		if (!this.page) {
			throw new Error('Browser is not initialized')
		}
		return await allure.step(`Get text from element ${selector}`, async () => {
			try {
				const element = await this.page.waitForSelector(selector, {state: 'visible', timeout: DEFAULT_TIMEOUT})
				return element.innerText()
			} catch (e) {
				if (options?.isMandatory) {
					throw new Error(`Error: ${e}`)
				}
				return 'placeholder text'
			}
		})
	}
	public async getElementAttribute(selector: string, attribute: string): Promise<string> {
		if (!this.page) {
			throw new Error('Browser is not initialized')
		}
		let element: ElementHandle<SVGElement | HTMLElement>
		try {
			element = await this.page.waitForSelector(selector, {state: 'visible', timeout: DEFAULT_TIMEOUT})
			const attrValue = await element.getAttribute(attribute)
			if (!attrValue) {
				return ''
			}
			return attrValue
		} catch (e) {
			return ''
		}
	}
	public async tearDown(): Promise<void> {
		if (this.page) {
			console.log(`[Closing page]`)
			await this.page.close()
			this.page = undefined as any
		}
		if (this.context) {
			console.log(`[Closing context]`)
			await this.context.close()
			this.context = undefined as any
		}
		if (this.browser) {
			console.log(`[Closing browser]`)
			await this.browser.close()
			this.browser = undefined as any
		}
	}
}
