import { Locator, Page } from "@playwright/test"
import { User } from "../test-data/test-data"


export class LoginPage {
    private readonly loginSection: Locator
    readonly loginHeading: Locator
    readonly invalidLoginErrorMessage: Locator
    
    constructor(private readonly page: Page) {
        this.loginSection = this.page.locator('.login-form')
        this.loginHeading = this.loginSection.getByRole('heading', { name: 'Login to your account' })
        this.invalidLoginErrorMessage = this.loginSection.locator('p', { hasText: 'Your email or password is incorrect!' })
    }
    
    
    async login(user: User): Promise<void> {
        await this.page.getByTestId('login-email').fill(user.email)
        await this.page.getByTestId('login-password').fill(user.password)
        await this.page.getByTestId('login-button').click()
    }
}