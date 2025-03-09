import { Locator, Page } from "@playwright/test"


export class ProductDetailsPage {
    readonly page: Page
    readonly productInformation: Locator
    readonly productName: Locator
    readonly category: Locator
    readonly price: Locator
    readonly availability: Locator
    readonly condition: Locator
    readonly brand: Locator
    
    constructor(page: Page) {
        this.page = page
        this.productInformation = page.locator('.product-information')
        this.productName  = this.productInformation.getByRole('heading')
        this.category     = this.productInformation.locator('p', { hasText: 'Category:' })
        this.price        = this.productInformation.locator('span >> span')
        this.availability = this.productInformation.locator('p').filter({ hasText: 'Availability:' })
        this.condition    = this.productInformation.locator('p').filter({ hasText: 'Condition:' })
        this.brand        = this.productInformation.locator('p').filter({ hasText: 'Brand:' })
    }
    
    async viewProduct(productId: number) {
    }
}