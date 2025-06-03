
import { Locator, Page } from "@playwright/test"


export class ScrollUpButton {
    readonly scrollUpButton: Locator
    
    constructor(private readonly page: Page) {
        this.scrollUpButton = this.page.locator('#scrollUp')
    }
    
    async scrollToTop(): Promise<void> {
        await this.scrollUpButton.click()
    }
}