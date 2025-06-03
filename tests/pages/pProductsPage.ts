import { Locator, Page } from "@playwright/test"
import { ProductDetailsPage } from "./pProductDetailsPage"
import { Product, SearchError } from "../test-data/test-data"
import { normalizeText } from "../utils/utils"
import { CartModal } from "../components/CartModal"


export class ProductsPage {
    private readonly searchProductInput: Locator
    private readonly searchProductButton: Locator
    readonly searchedProductsHeader: Locator
    
    private readonly leftSidebar: Locator
    private readonly categorySection: Locator
    private readonly brandsSection: Locator
    
    private readonly allProductsSection: Locator
    private readonly allProducts: Locator
    
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
    
    async viewProduct(product: Product | number): Promise<ProductDetailsPage> {
        let index: number
        
        if (typeof product === 'number')
            index = product
        else if (typeof product === 'object' && product.order !== undefined)
            index = product.order
        else
            throw new Error('Invalid product input: must be index or Product with defined order')
        
        const productCard: Locator = this.allProducts.nth(index)
        await productCard.getByRole('link', { name: 'View Product' }).click()
        
        return new ProductDetailsPage(this.page)
    }
    
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
    
    
    async addAllProductsToCart(cartModal: CartModal): Promise<void> {
        const products: Locator[] = await this.allProducts.all()
        const productsCount: number = products.length
        
        for (let i: number = 0; i < productsCount; i++) {
            await this.addProductToCart(i)
            await cartModal.continueShopping()
        }
    }
    
    /**
     * Retrieves details of all products displayed on the products page.
     * It opens each product's details page to extract the full product information.
     * @returns A promise that resolves to an array of Product objects.
     */
    async getAllProductsDetails(): Promise<Product[]> {
        const products: Locator[] = await this.allProducts.all()
        
        return await Promise.all(
            products.map(async (productLocator: Locator) => {
                const href: string = await productLocator.locator('.choose >> a').getAttribute('href') as string
                const newPage: Page = await this.page.context().newPage()
                await newPage.goto(href, { waitUntil: 'domcontentloaded' })
                
                const productDetailsPage: ProductDetailsPage = new ProductDetailsPage(newPage)
                const product: Product = await productDetailsPage.getProductDetails()
                
                await newPage.close()
                return product
            })
        )
    }
    
    
    /**
     * Checks all displayed products on the products page. If their names and categories
     * do not match the search term, opens the product details page to verify the category.
     * Then returns a list of mismatches.
     * @param searchTerm - The term used to search for products.
     * @returns A list of SearchError objects containing mismatches.
     */
    async findIncorrectSearchResults(searchTerm: string): Promise<SearchError[]> {
        // Get all displayed product cards
        const products: Locator[] = await this.allProducts.all()
        const incorrectSearchResults: SearchError[] = []
        const searchTermNormalized: string = normalizeText(searchTerm)
        
        await Promise.all(
            products.map(async (productLocator: Locator) => {
                // Extract link to product details and visible product name
                const href: string = await productLocator.locator('.choose >> a').getAttribute('href') as string
                const productName: string = await productLocator.locator('.productinfo >> p').innerText()
                const productNameNormalized: string = normalizeText(productName)
                
                // If product name doesn't include the search term,
                // open the product details page and check if the category does.
                if (!productNameNormalized.includes(searchTermNormalized)) {
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
            })
        )
        
        return incorrectSearchResults
    }
}