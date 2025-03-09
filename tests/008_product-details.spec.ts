import { test, expect } from './fixtures/test.ts'
import { NavigationBar } from './pages/navigationBar.ts'
import { testProduct_BlueTop } from './test-data/test-data.ts'

test('Verify All Products and product detail page', async ({ page }) => {
    const navigationBar = new NavigationBar(page)
    
    const productsPage = await navigationBar.gotoProducts()
    await expect(page).toHaveURL('/products')
    
    const product = testProduct_BlueTop
    const productDetailsPage = await productsPage.viewProduct(product.id)
    await expect(page).toHaveURL('/product_details/' + product.id)
    
    await expect(productDetailsPage.productName).toContainText(product.name)
    await expect(productDetailsPage.category).toContainText(product.category)
    await expect(productDetailsPage.price).toContainText(product.price)
    await expect(productDetailsPage.availability).toContainText(product.availability)
    await expect(productDetailsPage.condition).toContainText(product.condition)
    await expect(productDetailsPage.brand).toContainText(product.brand)
})