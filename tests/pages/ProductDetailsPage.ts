import { Locator, Page } from "@playwright/test"
import { Product } from "../test-data/test-data"


export class ProductDetailsPage {
    private readonly productInformation: Locator
    private readonly name: Locator
    private readonly category: Locator
    private readonly price: Locator
    private readonly quantity: Locator
    private readonly availability: Locator
    private readonly condition: Locator
    private readonly brand: Locator
    
    private readonly addToCartButton: Locator
    
    private readonly reviewFormSection: Locator
    private readonly nameInput: Locator
    private readonly emailInput: Locator
    private readonly reviewInput: Locator
    private readonly submitReviewButton: Locator
    readonly reviewSubmittedMessage: Locator
    
    
    constructor(private readonly page: Page) {
        this.productInformation = this.page.locator('.product-information')
        this.name         = this.productInformation.getByRole('heading')
        this.category     = this.productInformation.locator('p', { hasText: 'Category:' })
        this.price        = this.productInformation.locator('span >> span').filter({ hasText: 'Rs.' })
        this.quantity     = this.productInformation.locator('#quantity')
        this.availability = this.productInformation.locator('p').filter({ hasText: 'Availability:' })
        this.condition    = this.productInformation.locator('p').filter({ hasText: 'Condition:' })
        this.brand        = this.productInformation.locator('p').filter({ hasText: 'Brand:' })
        
        this.addToCartButton = this.productInformation.getByRole('button', { name: 'Add to cart' })
        
        this.reviewFormSection = this.page.locator('#review-form')
        this.nameInput          = this.reviewFormSection.locator('#name')
        this.emailInput         = this.reviewFormSection.locator('#email')
        this.reviewInput        = this.reviewFormSection.locator('#review')
        this.submitReviewButton = this.reviewFormSection.locator('#button-review')
        this.reviewSubmittedMessage = this.reviewFormSection.getByText('Thank you for your review.')
    }
    
    
    async getProductDetails(): Promise<Product> {
        return {
            id:           this.page.url().split('/').pop()!,
            name:         await this.name.innerText(),
            category:     await this.category.innerText(),
            price:        await this.price.innerText(),
            availability: await this.availability.innerText(),
            condition:    await this.condition.innerText(),
            brand:        await this.brand.innerText(),
        }
    }
    
    async setAmount(amount: number): Promise<void> {
        await this.quantity.fill(amount.toString())
    }
    
    async addToCart(): Promise<void> {
        await this.addToCartButton.click()
    }
    
    async submitReview(name: string, email: string, review: string): Promise<void> {
        await this.nameInput.fill(name)
        await this.emailInput.fill(email)
        await this.reviewInput.fill(review)
        await this.submitReviewButton.click()
    }
}