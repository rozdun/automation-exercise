import { Locator } from "@playwright/test"
import { CartProduct } from "../test-data/test-data"


export class CartTable {
    constructor(private readonly root: Locator) {}
    
    async getProducts(hasTotalAmountRow = false): Promise<CartProduct[]> {
        const items: CartProduct[] = []
        let rows: number = await this.root.locator('tbody > tr').count()
        
        if (hasTotalAmountRow)
            rows--
        
        for (let i: number = 0; i < rows; i++) {
            const row: Locator = this.root.locator('tbody > tr').nth(i)
            
            const name: string     = await row.locator('.cart_description >> a').innerText()
            const category: string = await row.locator('.cart_description >> p').innerText()
            const price: string    = await row.locator('.cart_price >> p').innerText()
            const quantity: string = await row.locator('.cart_quantity').getByRole('button').innerText()
            const total: string    = await row.locator('.cart_total >> p').innerText()
            
            items.push({ name, category, price, quantity, total })
        }
        
        return items
    }
}