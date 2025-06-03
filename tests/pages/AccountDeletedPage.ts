import { Locator, Page } from '@playwright/test'

export class AccountDeletedPage {
    private readonly continueButton: Locator

    constructor(private readonly page: Page) {
        this.continueButton = this.page.getByTestId('continue-button')
    }
    
    
    async continueToHome(): Promise<void> {
        await this.continueButton.click()
    }
}
