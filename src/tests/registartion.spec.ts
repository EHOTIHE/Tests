import {Page} from 'playwright'
import {Browser} from '../helpers/browser.helper'
import { mainPage } from '../pages/main.page'
import { registrationPage } from '../pages/registration.page'
import { verifyEmailPage } from '../pages/verify-Email.page'
import { randomNumber } from '../utils/randomizer';


let browser: Browser
let page: Page


describe('Registration page flows', () => {
	beforeEach(async () => {
		browser = new Browser()
		await browser.setup()
		page = browser.getPage()
	})

	it('Chech successfull regostration flow', async () => {
		await page.goto(mainPage.url)
        await page.click(mainPage.sighUpButton)
		await page.fill(registrationPage.fullNameInput, 'Ivan Ivanovich')
		await page.fill(registrationPage.emailInput, `${randomNumber()}@ya.com`)
		await page.fill(registrationPage.passwordInput, 'Fyfyfc!23')
		await page.fill(registrationPage.repeatPasswordInput, 'Fyfyfc!23')
		await page.click(registrationPage.privacyPolicyCheckbox)
		await page.click(registrationPage.sighUpButton)
		const verifyEmailPageTitle = await browser.getElementText(verifyEmailPage.pageTitle)
		expect(verifyEmailPageTitle).toEqual('Verify your email')
	})
	it('Check that user can not pass the registration with empty full name field ', async () => {
		await page.goto(registrationPage.url)
		await page.fill(registrationPage.emailInput, 'ehot@ya.com')
		await page.fill(registrationPage.passwordInput, 'Fyfyfc!23')
		await page.fill(registrationPage.repeatPasswordInput, 'Fyfyfc!23')
		await page.click(registrationPage.privacyPolicyCheckbox)
		const buttonAvailability = await browser.getElementAttribute(registrationPage.sighUpButton, 'disabled')
		expect(buttonAvailability).toEqual('disabled')
	})
	it('Check that user can not pass the registration with empty email field', async () => {
		await page.goto(registrationPage.url)
		await page.fill(registrationPage.fullNameInput, 'Ivan Ivanovich')
		await page.fill(registrationPage.passwordInput, 'Fyfyfc!23')
		await page.fill(registrationPage.repeatPasswordInput, 'Fyfyfc!23')
		await page.click(registrationPage.privacyPolicyCheckbox)
		const buttonAvailability = await browser.getElementAttribute(registrationPage.sighUpButton, 'disabled')
		expect(buttonAvailability).toEqual('disabled')
	})
	it('Check that user can not pass the registration with empty password field', async () => {
		await page.goto(registrationPage.url)
		await page.fill(registrationPage.fullNameInput, 'Ivan Ivanovich')
		await page.fill(registrationPage.emailInput, 'ehot@ya.com')
		await page.fill(registrationPage.repeatPasswordInput, 'Fyfyfc!23')
		await page.click(registrationPage.privacyPolicyCheckbox)
		const buttonAvailability = await browser.getElementAttribute(registrationPage.sighUpButton, 'disabled')
		expect(buttonAvailability).toEqual('disabled')
	})
	it('Check that user can not pass the registration with empty repeat password field', async () => {
		await page.goto(registrationPage.url)
		await page.fill(registrationPage.fullNameInput, 'Ivan Ivanovich')
		await page.fill(registrationPage.emailInput, 'ehot@ya.com')
		await page.fill(registrationPage.passwordInput, 'Fyfyfc!23')
		await page.click(registrationPage.privacyPolicyCheckbox)
		const buttonAvailability = await browser.getElementAttribute(registrationPage.sighUpButton, 'disabled')
		expect(buttonAvailability).toEqual('disabled')
	})
	it('Check that user can not pass the registration without provacy policy check box', async () => {
		await page.goto(registrationPage.url)
		await page.fill(registrationPage.fullNameInput, 'Ivan Ivanovich')
		await page.fill(registrationPage.emailInput, 'ehot@ya.com')
		await page.fill(registrationPage.passwordInput, 'Fyfyfc!23')
		await page.fill(registrationPage.repeatPasswordInput, 'Fyfyfc!23')
		const buttonAvailability = await browser.getElementAttribute(registrationPage.sighUpButton, 'disabled')
		expect(buttonAvailability).toEqual('disabled')
	})
	it.each([{email: '11111'},{email: '@ya.com'}, {email: 'ivanya.com'}, {email: 'ivan@.com'}, {email: 'ivan@yacom'}, {email: 'ivan@ya.c'}])('Check that user can not pass the registration with invalid email', async ({email}) => {
		await page.goto(registrationPage.url)
		await page.fill(registrationPage.fullNameInput, 'Ivan Ivanovich')
		await page.fill(registrationPage.emailInput, email)
		await page.fill(registrationPage.passwordInput, 'Fyfyfc!23')
		await page.fill(registrationPage.repeatPasswordInput, 'Fyfyfc!23')
		await page.click(registrationPage.privacyPolicyCheckbox)
		await page.click(registrationPage.emailInput)
		const buttonAvailability = await browser.getElementAttribute(registrationPage.sighUpButton, 'disabled')
		const errorMessageText = await browser.getElementText(registrationPage.invalidEmailError)
		expect(buttonAvailability).toEqual('disabled')
		expect(page.isVisible(registrationPage.invalidEmailError)).toBeTruthy
		expect(errorMessageText).toEqual('Please enter proper email')
	})
	it.each([{password: 'Fyfy!22'},{password: 'fyfyfc!23'}, {password: 'Fyfyfc!@#'}, {password: 'FYFYFC!23'}, {password: 'Fyfyfc123'}, {password: '123123123123!'}, {password: 'Ананас!2'}])('Check that user can not pass the registration with unvalid password', async ({password}) => {
		await page.goto(registrationPage.url)
		await page.fill(registrationPage.fullNameInput, 'Ivan Ivanovich')
		await page.fill(registrationPage.emailInput, 'ivan@ya.com')
		await page.fill(registrationPage.passwordInput, password)
		await page.fill(registrationPage.repeatPasswordInput, password)
		await page.click(registrationPage.privacyPolicyCheckbox)
		const buttonAvailability = await browser.getElementAttribute(registrationPage.sighUpButton, 'disabled')
		const errorMessageText = await browser.getElementText(registrationPage.invalidPasswordError)
		expect(buttonAvailability).toEqual('disabled')
		expect(page.isVisible(registrationPage.invalidPasswordError)).toBeTruthy
		expect(errorMessageText).toContain('Password should contain at least 8 symbols and one capital letter, one special symbols like «$#%!_}{[]» and one number, for your security')
	})
	it('Check that user can not pass the registration when passwords do not match in password and repeat password fields', async () => {
		await page.goto(registrationPage.url)
		await page.fill(registrationPage.fullNameInput, 'Ivan Ivanovich')
		await page.fill(registrationPage.emailInput, 'ehot@ya.com')
		await page.fill(registrationPage.passwordInput, 'Fyfyfc!2555')
		await page.fill(registrationPage.repeatPasswordInput, 'Fyfyfc!23')
		const errorMessageText = await browser.getElementText(registrationPage.passwordsMatchError)
		const buttonAvailability = await browser.getElementAttribute(registrationPage.sighUpButton, 'disabled')
		expect(page.isVisible(registrationPage.passwordsMatchError)).toBeTruthy
		expect(buttonAvailability).toEqual('disabled')
		expect(errorMessageText).toEqual('Passwords do not match')
	})
	it('Check that user can return to the main page from registration using home button', async () => {
		await page.goto(registrationPage.url)
		await page.fill(registrationPage.fullNameInput, 'Ivan Ivanovich')
		await page.fill(registrationPage.emailInput, 'ehot@ya.com')
		await page.fill(registrationPage.passwordInput, 'Fyfyfc!23')
		await page.fill(registrationPage.repeatPasswordInput, 'Fyfyfc!23')
		await page.click(registrationPage.privacyPolicyCheckbox)
		await page.click(registrationPage.homeButton)
		const mainPageTitleText = await browser.getElementText(mainPage.mainPageTitle)
		expect(page.isVisible(mainPage.mainPageTitle)).toBeTruthy
		expect(mainPageTitleText).toContain('easily and securely')
	})

	describe('Privacy Policy modal window', () => {

	it('Check that user can open privacy policy to read', async () => {
		await page.goto(registrationPage.url)
		await page.click(registrationPage.privacyPolicyLink)
		const modalWindowTitleText = await browser.getElementText(registrationPage.privacyPolicyModalWindowTitle)
		expect(modalWindowTitleText).toEqual('Privacy Policy')
		})
		it('Check that user can close privacy policy modal window clicking on OK button', async () => {
			await page.goto(registrationPage.url)
			await page.click(registrationPage.privacyPolicyLink)
			await page.click(registrationPage.privacyPolicyOkButton)
			const registrationPageTitleText = await browser.getElementText(registrationPage.registrationPageTitle)
			expect(page.isVisible(registrationPage.passwordInput)).toBeTruthy
			expect(registrationPageTitleText).toEqual('Registration')
		})
		it('Check that user can close privacy policy modal window clicking on cross button', async () => {
			await page.goto(registrationPage.url)
			await page.click(registrationPage.privacyPolicyLink)
			await page.click(registrationPage.privacyPolicyCrossButton)
			const registrationPageTitleText = await browser.getElementText(registrationPage.registrationPageTitle)
			expect(page.isVisible(registrationPage.passwordInput)).toBeTruthy
			expect(registrationPageTitleText).toEqual('Registration')
		})
	})
	describe('Try it for free flow', () => {
		it('Check that user can use first try it for free button to go to the registration page', async () => {
			await page.goto(mainPage.url)
			await page.click(mainPage.tryItForFreeFirstButton)
			await page.fill(registrationPage.fullNameInput, 'Ivan Ivanovich')
			await page.fill(registrationPage.emailInput, `${randomNumber()}@ya.com`)
			await page.fill(registrationPage.passwordInput, 'Fyfyfc!23')
			await page.fill(registrationPage.repeatPasswordInput, 'Fyfyfc!23')
			await page.click(registrationPage.privacyPolicyCheckbox)
			await page.click(registrationPage.sighUpButton)
			const verifyEmailPageTitle = await browser.getElementText(verifyEmailPage.pageTitle)
			expect(verifyEmailPageTitle).toEqual('Verify your email')
		})
		it('Check that user can use second try it for free button to go to the registration page', async () => {
			await page.goto(mainPage.url)
			await page.click(mainPage.tryItForFreeSecondButton)
			await page.fill(registrationPage.fullNameInput, 'Ivan Ivanovich')
			await page.fill(registrationPage.emailInput, `${randomNumber()}@ya.com`)
			await page.fill(registrationPage.passwordInput, 'Fyfyfc!23')
			await page.fill(registrationPage.repeatPasswordInput, 'Fyfyfc!23')
			await page.click(registrationPage.privacyPolicyCheckbox)
			await page.click(registrationPage.sighUpButton)
			const verifyEmailPageTitle = await browser.getElementText(verifyEmailPage.pageTitle)
			expect(verifyEmailPageTitle).toEqual('Verify your email')
		})
	})
})
