import { Locator, Page } from "@playwright/test"
import { ProductDetailsPage } from "./ProductDetailsPage"
import { CartPage } from "./CartPage"


export class ProductsPage {
    readonly page: Page
    
    readonly searchProductInput: Locator
    readonly searchProductButton: Locator
    readonly searchedProductsHeader: Locator
    
    readonly cartModal: Locator
    readonly continueShoppingButton: Locator
    readonly viewCartButton: Locator
    
    readonly leftSidebar: Locator
    readonly categorySection: Locator
    readonly brandsSection: Locator
    
    readonly allProductsSection: Locator
    readonly allProducts: Locator
    
    
    constructor(page: Page) {
        this.page = page
        
        this.searchProductInput = page.getByRole('textbox', { name: 'Search Product' })
        this.searchProductButton = page.locator('#submit_search')
        this.searchedProductsHeader = page.getByRole('heading', { name: 'Searched Products' })
        
        this.cartModal = page.locator('#cartModal')
        this.continueShoppingButton = this.cartModal.getByRole('button', { name: 'Continue Shopping' })
        this.viewCartButton = this.cartModal.getByText('View Cart')
        
        this.leftSidebar = page.locator('.left-sidebar')
        this.categorySection = this.leftSidebar.locator('#accordian')
        this.brandsSection = this.leftSidebar.locator('.brands_products')
        
        this.allProductsSection = page.locator('.features_items')
        this.allProducts = this.allProductsSection.locator('.col-sm-4')
    }
    
    
    async searchProduct(searchText: string) {
        await this.searchProductInput.fill(searchText)
        await this.searchProductButton.click()
    }
    
    async viewProduct(index: number) {
        const product = this.allProducts.nth(index)
        await product.getByRole('link', { name: 'View Product' }).click()
        
        return new ProductDetailsPage(this.page)
    }
    
    
    async addProductToCart(productId: number) {
        const product = this.allProducts.nth(productId)
        await product.locator('.productinfo >> .add-to-cart').click()
    }
    
    async continueShopping() {
        await this.continueShoppingButton.click()
    }
    
    async viewCart() {
        await this.viewCartButton.click()
        
        return new CartPage(this.page)
    }
    
    async getProductInfo(product: Locator) {
        const href = await product.locator('.choose >> a').getAttribute('href')
        const productName = await product.locator('.productinfo >> p').innerText()
        
        return {
            href,
            productName
        }
    }
    
}