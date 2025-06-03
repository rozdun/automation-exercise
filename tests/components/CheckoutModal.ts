import { Locator, Page } from "@playwright/test"
import { SignupPage } from "../pages/SignupPage"
import { LoginPage } from "../pages/LoginPage"


export class CheckoutModal {
    private readonly checkoutModal: Locator
    private readonly continueOnCartButton: Locator
    private readonly viewCartButton: Locator
    
    constructor(private readonly page: Page) {
        this.checkoutModal = this.page.locator('#checkoutModal')
        this.continueOnCartButton = this.checkoutModal.getByRole('button', { name: 'Continue On Cart' })
        this.viewCartButton = this.checkoutModal.getByRole('link', { name: 'Register / Login' })
    }
    
    
    async proceedToSignup(): Promise<SignupPage> {
        await this.viewCartButton.click()
        
        return new SignupPage(this.page)
    }
    
    async proceedToLogin(): Promise<LoginPage> {
        await this.viewCartButton.click()
        
        return new LoginPage(this.page)
    }
    
    async continueOnCart(): Promise<void> {
        await this.continueOnCartButton.click()
    }
}