/// <reference types="playwright" />
declare interface BrowserService {
	initTest(testFullName: string, testPath: string): void
	setupBrowserContext(
		browserOptions: import('../src/services/browser.service').BrowserOptions
	): Promise<import('playwright').BrowserContext>
	cleanBrowserContext(testName: string, isFailed: boolean): Promise<void>
	cleanBrowserInstance(): Promise<void>
	getTestFullName(): string
	getTestPath(): string
	getBrowser(): import('playwright').Browser
	getPage(index?: number): import('playwright').Page
}

declare let browserService: BrowserService
