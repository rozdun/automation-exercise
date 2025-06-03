import { Locator, Page } from "@playwright/test"


export class HomePage {
    private readonly recommendedItemsSection: Locator
    private readonly visibleProducts: Locator
    
    constructor(private readonly page: Page) {
        this.recommendedItemsSection = this.page.locator('#recommended-item-carousel')
        this.visibleProducts = this.recommendedItemsSection.locator('.item.active >> div')
    }
    
    
    async getProductNameAndPrice(index: number): Promise<{name: string, price: string}> {
        const productCard: Locator = this.visibleProducts.nth(index)
        
        return {
            name:   await productCard.getByRole('paragraph').innerText(),
            price:  await productCard.getByRole('heading', { name: /Rs./ }).innerText(),
        }
    }
    
    async addProductToCart(index: number): Promise<void> {
        const productCard: Locator = this.visibleProducts.nth(index)
        await productCard.locator('a', { hasText: 'Add to cart' }).click()
    }
    
}