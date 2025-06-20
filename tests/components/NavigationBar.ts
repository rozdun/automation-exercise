import { Locator, Page } from "@playwright/test"
import { SignupPage } from "../pages/SignupPage"
import { LoginPage } from "../pages/LoginPage"
import { ContactUsPage } from "../pages/ContactUsPage"
import { AccountDeletedPage } from "../pages/AccountDeletedPage"
import { CartPage } from "../pages/CartPage"
import { ProductsPage } from "../pages/ProductsPage"


export class NavigationBar {
    private readonly header: Locator
    private readonly homeButton: Locator
    private readonly productsButton: Locator
    readonly cartButton: Locator
    readonly signupLoginButton: Locator
    private readonly testCasesButton: Locator
    private readonly contactUsButton: Locator
    
    private readonly logoutButton: Locator
    private readonly deleteAccountButton: Locator
    readonly accountDeletedMessage: Locator
    readonly loggedInUser: Locator
    
    constructor(private readonly page: Page) {
        this.header             = this.page.locator('#header')
        this.homeButton         = this.header.getByRole('link', { name: 'Home', exact: false })
        this.productsButton     = this.header.getByRole('link', { name: 'Products', exact: false })
        this.cartButton         = this.header.getByRole('link', { name: 'Cart', exact: false })
        this.signupLoginButton  = this.header.getByRole('link', { name: 'Signup / Login', exact: false })
        this.testCasesButton    = this.header.getByRole('link', { name: 'Test Cases', exact: false })
        this.contactUsButton    = this.header.getByRole('link', { name: 'Contact us', exact: false })
        
        this.logoutButton           = this.header.getByRole('link', { name: 'Logout', exact: false })
        this.deleteAccountButton    = this.header.getByRole('link', { name: 'Delete Account' })
        this.accountDeletedMessage  = this.page.getByTestId('account-deleted')
        this.loggedInUser           = this.page.locator('.nav >> b')
    }
    
    
    // Navigation
    async gotoHome(): Promise<void> {
        await this.homeButton.click()
    }
    
    async gotoProducts(): Promise<ProductsPage> {
        await this.productsButton.click()
        return new ProductsPage(this.page)
    }
    
    async gotoCart(): Promise<CartPage> {
        await this.cartButton.click()
        return new CartPage(this.page)
    }
    
    async gotoSignup(): Promise<SignupPage> {
        await this.signupLoginButton.click()
        return new SignupPage(this.page)
    }
    
    async gotoLogin(): Promise<LoginPage> {
        await this.signupLoginButton.click()
        return new LoginPage(this.page)
    }
    
    async gotoContactUs(): Promise<ContactUsPage> {
        await this.contactUsButton.click()

        // Wait briefly for possible error page
        const errorHeading: Locator = this.page.getByRole('heading', { name: /under heavy load/i })
        const errorVisible: boolean = await Promise.race([
            errorHeading.isVisible({ timeout: 1000 }),
            this.page.waitForSelector('#contact-page', { timeout: 3000 }).then(() => false)
        ])

        if (errorVisible) {
            throw new Error('Server queue page detected: Contact Us page not available')
        }

        await this.page.waitForLoadState('domcontentloaded')
        return new ContactUsPage(this.page)
    }
    
    async gotoTestCases(): Promise<void> {
        await this.testCasesButton.click()
    }

    
    
    // Logged in user
    async logout(): Promise<void> {
        await this.logoutButton.click()
    }
    
    async deleteAccount(): Promise<AccountDeletedPage> {
        await this.deleteAccountButton.click()
        return new AccountDeletedPage(this.page)
    }
}