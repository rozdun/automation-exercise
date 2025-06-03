import { Locator, Page } from "@playwright/test"
import * as path from 'path'
import { dirname } from "path"
import { fileURLToPath } from "url"

export class ContactUsPage {
    private readonly contactForm: Locator
    readonly getInTouchHeading: Locator
    private readonly chooseFileButton: Locator
    readonly messageSentMessage: Locator
    private readonly returnHomeButton: Locator
    
    constructor(private readonly page: Page) {
        this.contactForm        = this.page.locator('#contact-page >> .contact-form')
        this.getInTouchHeading  = this.contactForm.locator('h2.title')
        this.chooseFileButton   = this.contactForm.locator('input[name="upload_file"]')
        this.messageSentMessage = this.contactForm.locator('.status.alert.alert-success')
        this.returnHomeButton   = this.contactForm.locator('.btn-success')
    }
    
    
    async fillContactForm(): Promise<void> {
        await this.contactForm.getByTestId('name').fill('name')
        await this.contactForm.getByTestId('email').fill('email@email.com')
        await this.contactForm.getByTestId('subject').fill('subject')
        await this.contactForm.getByTestId('message').fill('message')
        
        const __filename: string = fileURLToPath(import.meta.url)
        const __dirname: string = dirname(__filename)
        const filePath: string = path.resolve(__dirname, '../test-data/image.png')
        await this.chooseFileButton.setInputFiles(filePath)
    }
    
    async submitMessage(): Promise<void> {
        await Promise.all([
            this.page.waitForEvent('dialog').then(dialog => dialog.accept()),
            this.page.getByTestId('submit-button').click()
        ])
    }
    
    async returnHome(): Promise<void> {
        await this.returnHomeButton.click()
    }
}