import { Locator, Page } from "@playwright/test"
import { CartPage } from "../pages/CartPage"


export class CartModal {
    private readonly cartModal: Locator
    private readonly continueShoppingButton: Locator
    private readonly viewCartButton: Locator
    
    constructor(private readonly page: Page) {
        this.cartModal = this.page.locator('#cartModal')
        this.continueShoppingButton = this.cartModal.getByRole('button', { name: 'Continue Shopping' })
        this.viewCartButton = this.cartModal.getByText('View Cart')
    }
    
    
    async continueShopping(): Promise<void> {
        await this.continueShoppingButton.click()
    }
    
    async viewCart(): Promise<CartPage> {
        await this.viewCartButton.click()
        
        return new CartPage(this.page)
    }
}