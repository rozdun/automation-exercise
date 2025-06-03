import { Locator, Page } from "@playwright/test"
import { User } from "../test-data/test-data"


export class Footer {
    private readonly footer: Locator
    readonly subscriptionHeader: Locator
    private readonly subscriptionEmailInput: Locator
    private readonly subscriptionSubmitButton: Locator
    readonly subscriptionSuccessMessage: Locator
    
    constructor(private readonly page: Page) {
        this.footer = this.page.locator('#footer')
        this.subscriptionHeader = this.footer.getByRole('heading', { name: 'Subscription' })
        this.subscriptionEmailInput = this.footer.locator('#susbscribe_email')
        this.subscriptionSubmitButton = this.footer.locator('#subscribe')
        this.subscriptionSuccessMessage = this.footer.locator('#success-subscribe')
    }
    
    
    async subscribeToNewsletter(user: User): Promise<void> {
        await this.subscriptionEmailInput.fill(user.email)
        await this.subscriptionSubmitButton.click()
    }
}