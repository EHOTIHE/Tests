declare namespace NodeJS {
	interface Global {
		browserService: import('../src/services/browser.service').BrowserService
	}
}
