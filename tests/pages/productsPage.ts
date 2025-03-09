import { Locator, Page } from "@playwright/test"
import { ProductDetailsPage } from "./productDetailsPage"


export class ProductsPage {
    readonly page: Page
    readonly allProducts: Locator
    
    constructor(page: Page) {
        this.page = page
        this.allProducts = page.locator('.features_items > .col-sm-4')
    }
    
    async viewProduct(productId: number) {
        const product = this.allProducts.nth(productId - 1)
        await product.getByRole('link', { name: 'View Product' }).click()
        
        return new ProductDetailsPage(this.page)
    }
}