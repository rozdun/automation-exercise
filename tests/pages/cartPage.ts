import { Locator, Page } from "@playwright/test"


export class CartPage {
    readonly page: Page
    
    readonly cartItems: Locator
    readonly productList: Locator
    
    constructor(page: Page) {
        this.page = page
        
        this.cartItems = page.locator('#cart_items')
        this.productList = page.locator('#cart_info_table >> tbody >> tr')
    }
    
    async login({ email, password }: { email: string, password: string }) {
        await this.page.getByTestId('login-email').fill(email)
        await this.page.getByTestId('login-password').fill(password)
        await this.page.getByTestId('login-button').click()
    }
}