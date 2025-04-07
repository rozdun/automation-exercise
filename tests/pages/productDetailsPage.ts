import { Locator, Page } from "@playwright/test"


export class ProductDetailsPage {
    readonly page: Page
    readonly productInformation: Locator
    readonly name: Locator
    readonly category: Locator
    readonly price: Locator
    readonly availability: Locator
    readonly condition: Locator
    readonly brand: Locator
    
    constructor(page: Page) {
        this.page = page
        this.productInformation = page.locator('.product-information')
        this.name         = this.productInformation.getByRole('heading')
        this.category     = this.productInformation.locator('p', { hasText: 'Category:' })
        this.price        = this.productInformation.locator('span >> span')
        this.availability = this.productInformation.locator('p').filter({ hasText: 'Availability:' })
        this.condition    = this.productInformation.locator('p').filter({ hasText: 'Condition:' })
        this.brand        = this.productInformation.locator('p').filter({ hasText: 'Brand:' })
    }
    
    async getProductDetails() {
        return {
            id: this.page.url().split('/').pop(),
            name: await this.name.innerText(),
            category: await this.category.innerText(),
            price: await this.price.innerText(),
            availability: await this.availability.innerText(),
            condition: await this.condition.innerText(),
            brand: await this.brand.innerText(),
        }
    }
}