import { Locator, Page } from "@playwright/test"


export class Footer {
    readonly page: Page
    
    readonly footer: Locator
    readonly subscriptionHeader: Locator
    readonly subscriptionEmailInput: Locator
    readonly subscriptionSubmitButton: Locator
    readonly subscriptionSuccessMessage: Locator
    
    constructor(page: Page) {
        this.page = page
        
        this.footer = page.locator('#footer')
        this.subscriptionHeader = this.footer.getByRole('heading', { name: 'Subscription' })
        this.subscriptionEmailInput = this.footer.locator('#susbscribe_email')
        this.subscriptionSubmitButton = this.footer.locator('#subscribe')
        this.subscriptionSuccessMessage = this.footer.locator('#success-subscribe')
    }
    
    
    async subscribeToNewsletter({ email }: { email: string }) {
        await this.subscriptionEmailInput.fill(email)
        await this.subscriptionSubmitButton.click()
    }
}