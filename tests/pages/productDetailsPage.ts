import { Locator, Page } from "@playwright/test"
import { Product } from "../test-data/test-data"


export class ProductDetailsPage {
    readonly productInformation: Locator
    readonly name: Locator
    readonly category: Locator
    readonly price: Locator
    readonly availability: Locator
    readonly condition: Locator
    readonly brand: Locator
    
    readonly addToCartButton: Locator
    
    constructor(private readonly page: Page) {
        this.productInformation = this.page.locator('.product-information')
        this.name         = this.productInformation.getByRole('heading')
        this.category     = this.productInformation.locator('p', { hasText: 'Category:' })
        this.price        = this.productInformation.locator('#quantity')
        this.availability = this.productInformation.locator('p').filter({ hasText: 'Availability:' })
        this.condition    = this.productInformation.locator('p').filter({ hasText: 'Condition:' })
        this.brand        = this.productInformation.locator('p').filter({ hasText: 'Brand:' })
        
        this.addToCartButton = this.productInformation.getByRole('button', { name: 'Add to cart' })
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
        await this.price.fill(amount.toString())
    }
    
    async addToCart(): Promise<void> {
        await this.addToCartButton.click()
    }
}