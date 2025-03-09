import { Locator, Page } from '@playwright/test'

export class AccountDeletedPage {
    readonly page: Page
    readonly continueButton: Locator

    constructor(page: Page) {
        this.page = page
        this.continueButton = page.getByTestId('continue-button')
    }

    async continueToHome() {
        await this.continueButton.click()
    }
}
