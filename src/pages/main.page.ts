export const mainPage = {
	url: 'https://rabata.io/',
	sighUpButton: `//a[@class="header-signup"]`,
	mainPageTitle: `//h1[contains(., "Organize your data")]`,
    tryItForFreeFirstButton: `//a[contains(., "Try it for free")]`,
    tryItForFreeSecondButton: `//a[contains(., "Try it For Free")]`,


    sThreePlan: `//div[@id="tariffBtn_0"]/input[@type="radio"]`,
    backupPlan: `//div[@id="tariffBtn_1"]`,
	calculatorMenu: `//header[contains(@class, "header")]/div/a[@href="#calculator"]`,
	totalDataStoredBar: `//input[@id="dataApiStoredInput"]`, 
	monthlyDownloadedDataBar: `//input[@id="dataDownloadInput"]`,
	backupPlantotalDataStoredBar: `//input[@id="dataStoredInput"]`,
	diagramaPartForSreenshoots: `//canvas[@id="dataApiChart"]`,
	diagramaPartForSreenshootsBackupPlan: `//canvas[@id="dataStoredChart"]`

	////div[@class="modal-container"]/div[contains(@class, "btn flex flex-center justify-center modal-close-btn")
}
