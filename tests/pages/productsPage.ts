import { Locator, Page } from "@playwright/test"
import { ProductDetailsPage } from "./ProductDetailsPage"
import { Product, SearchError } from "../test-data/test-data"
import { normalizeText } from "../utils/utils"


export class ProductsPage {
    readonly searchProductInput: Locator
    readonly searchProductButton: Locator
    readonly searchedProductsHeader: Locator
    
    readonly leftSidebar: Locator
    readonly categorySection: Locator
    readonly brandsSection: Locator
    
    readonly allProductsSection: Locator
    readonly allProducts: Locator
    
    constructor(private readonly page: Page) {
        this.searchProductInput = this.page.getByRole('textbox', { name: 'Search Product' })
        this.searchProductButton = this.page.locator('#submit_search')
        this.searchedProductsHeader = this.page.getByRole('heading', { name: 'Searched Products' })
        
        this.leftSidebar = this.page.locator('.left-sidebar')
        this.categorySection = this.leftSidebar.locator('#accordian')
        this.brandsSection = this.leftSidebar.locator('.brands_products')
        
        this.allProductsSection = this.page.locator('.features_items')
        this.allProducts = this.allProductsSection.locator('.col-sm-4')
    }
    
    
    async searchProduct(searchText: string): Promise<void> {
        await this.searchProductInput.fill(searchText)
        await this.searchProductButton.click()
    }
    
    async viewProduct(product: Product): Promise<ProductDetailsPage> {
        const productCard: Locator = this.allProducts.nth(product.order!)
        await productCard.getByRole('link', { name: 'View Product' }).click()
        
        return new ProductDetailsPage(this.page)
    }
    
    /**
     * Adds a product to the cart by index or by product object with defined `order`.
     * @param product - Either the product index or a Product with an `order` field.
     */
    async addProductToCart(product: Product | number): Promise<void> {
        let index: number
        
        if (typeof product === 'number')
            index = product
        else if (typeof product === 'object' && product.order !== undefined)
            index = product.order
        else
            throw new Error('Invalid product input: must be index or Product with defined order')
        
        const productCard: Locator = this.allProducts.nth(index)
        await productCard.locator('.productinfo >> .add-to-cart').click()
    }

    
    async addAllProductsToCart(): Promise<void> {
        const products: Locator[] = await this.allProducts.all()
        
        await Promise.all(
            products.map(
                async (productLocator: Locator) => {
                    await productLocator.locator('.productinfo >> .add-to-cart').click()
                }
            )
        )
    }
    
    
    async findIncorrectSearchResults(searchTerm: string): Promise<SearchError[]> {
        // Get all displayed product cards
        const products: Locator[] = await this.allProducts.all()
        const incorrectSearchResults: SearchError[] = []
        const searchTermNormalized: string = normalizeText(searchTerm)
        
        await Promise.all(
            products.map(
                async (productLocator: Locator) => {
                    // Extract link to product details and visible product name
                    const href: string | null = await productLocator.locator('.choose >> a').getAttribute('href')
                    const productName: string = await productLocator.locator('.productinfo >> p').innerText()
                    const productNameNormalized: string = normalizeText(productName)
                    
                    // If product name doesn't include the search term,
                    // open the product details page and check if the category does.
                    if (!productNameNormalized.includes(searchTermNormalized)) {
                        if (href) {
                            const newPage: Page = await this.page.context().newPage()
                            await newPage.goto(href, { waitUntil: 'domcontentloaded' })
                            
                            const productDetailsPage: ProductDetailsPage = new ProductDetailsPage(newPage)
                            const product: Product = await productDetailsPage.getProductDetails()
                            const categoryNormalized: string = normalizeText(product.category!)
                            
                            // Add mismatch if category also doesn't match
                            if (!categoryNormalized.includes(searchTermNormalized)) {
                                incorrectSearchResults.push({
                                    href,
                                    expected: searchTerm,
                                    name: product.name,
                                    category: product.category
                                })
                            }
                            
                            await newPage.close()
                        }
                        else {
                            // No href found - cannot validate further
                            incorrectSearchResults.push({
                                expected: searchTerm,
                                name: productName,
                                other: 'href not found'
                            })
                        }
                    }
                }
            )
        )
        
        return incorrectSearchResults
    }
}