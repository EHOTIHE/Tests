export const registrationPage = {
	url: 'https://rabata.io/signup',
    homeButton: `//a[@class="back-link flex flex-center"]`,
    registrationPageTitle: `//div[@class="h2" and contains(.,"Registration")]`,
    fullNameInput: `//input[@id="registration_form_fullName"]`,
    emailInput: `//input[@id="registration_form_email"]`,
    passwordInput: `//input[@id="registration_form_plainPassword_first"]`,
    repeatPasswordInput: `//input[@id="registration_form_plainPassword_second"]`,
    privacyPolicyCheckbox: `//label[@for="registration_form_agreeTerms"]`,

    sighUpButton: `//button[contains(., "Sign up")]`,
    logInbutton: `//a[contains(., "Log in")]`,

    //privacy policy modal window
    privacyPolicyLink: `//span[@onclick="modalPrivacy.show()"]`,
    privacyPolicyCrossButton: `//div[@id="modalPrivacy"]//div[contains(@class, "modal-close modal-close-btn")]`,
    privacyPolicyOkButton: `//div[@id="modalPrivacy"]//div[contains(@class, "justify-center")]`,
    privacyPolicyModalWindowTitle: `//div[@id="modalPrivacy"]//div[contains(@class, "text-center")]`,

    //errors
    invalidEmailError: `//span[@class][contains(., "email")]`,
      // пробел специально тк у другой ошибки на конце s
    invalidPasswordError: `//span[@class][contains(., "Password ")]`,
    passwordsMatchError: `//span[@class][contains(., "Passwords")]`,

}