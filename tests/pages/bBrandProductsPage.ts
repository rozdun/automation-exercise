import { Locator, Page } from "@playwright/test"


export class BrandProductsPage {
    private readonly categoryTree: Locator
    readonly categoryProductsHeader: Locator
    
    constructor(private readonly page: Page) {
        this.categoryTree = this.page.locator('.breadcrumbs >> .active')
        this.categoryProductsHeader = this.page.locator('.features_items >> .title')
    }
    
}