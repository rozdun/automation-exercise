import { Locator, Page } from "@playwright/test"


export class OrderConfirmationPage {
    private readonly orderSuccessfulSection: Locator
    readonly orderPlacedHeading: Locator
    private readonly downloadInvoiceButton: Locator
    private readonly continueButton: Locator
    
    constructor(private readonly page: Page) {
        this.orderSuccessfulSection = this.page.locator('#form')
        this.orderPlacedHeading     = this.orderSuccessfulSection.getByTestId('order-placed')
        this.downloadInvoiceButton  = this.orderSuccessfulSection.getByRole('link', { name: 'Download Invoice' })
        this.continueButton         = this.orderSuccessfulSection.getByRole('link', { name: 'Continue' })
    }
    
    
    
    async continueToHome(): Promise<void> {
        await this.continueButton.click()
    }
}