import {Page} from 'playwright'
import {Browser} from '../helpers/browser.helper'
import { mainPage } from '../pages/main.page'


let browser: Browser
let page: Page


describe('Calculators flow', () => {
	beforeEach(async () => {
		browser = new Browser()
		await browser.setup()
		page = browser.getPage()
	})

	it('s3 plan total data stored 500tb monthly downloaded 10', async () => {

      await page.goto(mainPage.url)
      await page.waitForLoadState('domcontentloaded')
      await page.click(mainPage.calculatorMenu)
      const box = await page.locator(mainPage.monthlyDownloadedDataBar).boundingBox()
      let width = box?.width
      const val = width! / 1000
      const x1 = val * 10
      
      const boxForTotal = await page.locator(mainPage.totalDataStoredBar).boundingBox()
      width=boxForTotal?.width
      const valForTotal = width! / 1000
      const x2 = valForTotal * 500
      await page.locator(mainPage.totalDataStoredBar).click({position: {x: x2, y: 0}})
      await page.locator(mainPage.monthlyDownloadedDataBar).click({position: {x: x1, y: 0}})
      const moneyScreen = await browser.takeScreenshot(mainPage.diagramaPartForSreenshoots,{prefix: 's3-plan-1stflow'})
      expect(moneyScreen).toMatchSnapshot()
	})
  
  it('s3 plan total data stored 10tb monthly downloaded 500tb', async () => {

    await page.goto(mainPage.url)
    await page.waitForLoadState('domcontentloaded')
    await page.click(mainPage.calculatorMenu)
    const box = await page.locator(mainPage.monthlyDownloadedDataBar).boundingBox()
    let width = box?.width
    const val = width! / 1000
    const x1 = val * 500
    
    const boxForTotal = await page.locator(mainPage.totalDataStoredBar).boundingBox()
    width=boxForTotal?.width
    const valForTotal = width! / 1000
    const x2 = valForTotal * 10
    await page.locator(mainPage.totalDataStoredBar).click({position: {x: x2, y: 0}})
    await page.locator(mainPage.monthlyDownloadedDataBar).click({position: {x: x1, y: 0}})
    const moneyScreen = await browser.takeScreenshot(mainPage.diagramaPartForSreenshoots,{prefix: 's3-plan-2ndflow'})
    expect(moneyScreen).toMatchSnapshot()
  })
  it('backup plan 1000tb', async () => {

    await page.goto(mainPage.url)
    await page.waitForLoadState('domcontentloaded')
    await page.click(mainPage.calculatorMenu)
    await page.click(mainPage.backupPlan)
    const box = await page.locator(mainPage.backupPlantotalDataStoredBar).boundingBox()
    const width = box?.width
    const val = width! / 1000
    const x1 = val * 1000 - 1
    
    await page.locator(mainPage.backupPlantotalDataStoredBar).click({position: {x: x1, y: 0}})
    const moneyScreen = await browser.takeScreenshot(mainPage.diagramaPartForSreenshootsBackupPlan,{prefix: 'backup-plan-1st-flow'})
    expect(moneyScreen).toMatchSnapshot()
  })
  it('backup plan 500tb', async () => {

    await page.goto(mainPage.url)
    await page.waitForLoadState('domcontentloaded')
    await page.click(mainPage.calculatorMenu)
    await page.click(mainPage.backupPlan)
    const box = await page.locator(mainPage.backupPlantotalDataStoredBar).boundingBox()
    const width = box?.width
    const val = width! / 1000
    const x1 = val * 500
    
    await page.locator(mainPage.backupPlantotalDataStoredBar).click({position: {x: x1, y: 0}})
    const moneyScreen = await browser.takeScreenshot(mainPage.diagramaPartForSreenshootsBackupPlan,{prefix: 'backup-plan-2nd-flow'})
    expect(moneyScreen).toMatchSnapshot()
  })
})