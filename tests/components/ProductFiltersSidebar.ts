import { Locator, Page } from "@playwright/test"
import { Category, Subcategory, Brand } from "../test-data/product-filters"
import { CategoryProductsPage } from "../pages/CategoryProductsPage"
import { BrandProductsPage } from "../pages/BrandProductsPage"

export class ProductFiltersSidebar {
    private readonly leftSidebar: Locator
    private readonly categoriesRoot: Locator
    private readonly brandsRoot: Locator
    
    constructor(private readonly page: Page) {
        this.leftSidebar    = this.page.locator('.left-sidebar')
        this.categoriesRoot = this.leftSidebar.locator('#accordian')
        this.brandsRoot     = this.leftSidebar.locator('.brands_products')
    }
    
    
    async setCategory(category: Category, subcategory: Subcategory): Promise<CategoryProductsPage> {
        await this.categoriesRoot.getByRole('link', { name: new RegExp(category.name) }).click()
        await this.categoriesRoot.locator(`#${category.name}`).getByRole('link', { name: subcategory }).click()
        
        return new CategoryProductsPage(this.page)
    }
    
    async setBrand(brand: Brand): Promise<BrandProductsPage> {
        await this.brandsRoot.getByRole('link', { name: brand }).click()
        
        return new BrandProductsPage(this.page)
    }
}