import { Locator, Page } from "@playwright/test"


export class LoginPage {
    readonly page: Page
    readonly loginSection: Locator
    readonly loginHeading: Locator
    readonly invalidLoginErrorMessage: Locator
    
    constructor(page: Page) {
        this.page = page
        this.loginSection = page.locator('.login-form')
        this.loginHeading = this.loginSection.getByRole('heading', { name: 'Login to your account' })
        this.invalidLoginErrorMessage = this.loginSection.locator('p', { hasText: 'Your email or password is incorrect!' })
    }
    
    async login({ email, password }: { email: string, password: string }) {
        await this.page.getByTestId('login-email').fill(email)
        await this.page.getByTestId('login-password').fill(password)
        await this.page.getByTestId('login-button').click()
    }
}