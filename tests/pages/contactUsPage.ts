import { Locator, Page } from "@playwright/test"
import path from 'path'

export class ContactUsPage {
    readonly page: Page
    readonly getInTouchHeading: Locator
    readonly messageSentMessage: Locator
    readonly returnHomeButton: Locator
    
    constructor(page: Page) {
        this.page = page
        this.getInTouchHeading  = page.getByRole('heading', { name: 'Get In Touch' })
        this.messageSentMessage = page.locator('#contact-page >> .alert-success', { hasText: 'Success! Your details have been submitted successfully.' })
        this.returnHomeButton   = page.locator('.btn-success')
    }
    
    async fillContactForm() {
        await this.page.getByTestId('name').fill('name')
        await this.page.getByTestId('email').fill('email@email.com')
        await this.page.getByTestId('subject').fill('subject')
        await this.page.getByTestId('message').fill('message')
        
        const filePath = path.resolve(__dirname, '../test-data/image.png')
        await this.page.locator('input[name="upload_file"]').setInputFiles(filePath)
    }
    
    async submitMessage() {
        this.page.on('dialog', async (dialog) => {
            await dialog.accept()
        })
        
        await this.page.getByTestId('submit-button').click()
    }
    
    async returnHome() {
        await this.returnHomeButton.click()
    }
}

//