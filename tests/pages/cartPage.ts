import { Locator, Page } from "@playwright/test"
import { CartProduct } from "../test-data/test-data"
import { CartTable } from "../components/CartTable"
import { CheckoutPage } from "./CheckoutPage"


export class CartPage {
    readonly cartItems: Locator
    readonly cartProductRows: Locator
    readonly cartIsEmptySection: Locator
    
    private readonly proceedToCheckoutButton: Locator
    
    constructor(private readonly page: Page) {
        this.cartItems = this.page.locator('#cart_items')
        this.cartProductRows = this.cartItems.locator('#cart_info_table >> tbody >> tr')
        this.cartIsEmptySection = this.cartItems.locator('#empty_cart')
        
        this.proceedToCheckoutButton = this.page.getByText('Proceed To Checkout')
    }
    
    
    async getCartProducts(): Promise<CartProduct[]> {
        return await new CartTable(this.cartProductRows).getProducts()
    }
    
    async removeProduct(order: number): Promise<void> {
        await this.cartProductRows.nth(order).locator('.cart_quantity_delete').click()
    }
    
    async proceedToCheckout(): Promise<CheckoutPage> {
        await this.proceedToCheckoutButton.click()
        return new CheckoutPage(this.page)
    }
}