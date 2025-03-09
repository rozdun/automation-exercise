import { Locator, Page } from "@playwright/test"
import { SignupPage } from "./signupPage"
import { LoginPage } from "./loginPage"
import { ContactUsPage } from "./contactUsPage"
import { ProductsPage } from "./productsPage"
import { AccountDeletedPage } from "./accountDeletedPage"


export class NavigationBar {
    readonly page: Page
    
    readonly header: Locator
    readonly loggedInUser: Locator
    readonly homeButton: Locator
    readonly productsButton: Locator
    readonly cartButton: Locator
    readonly signupLoginButton: Locator
    readonly testCasesButton: Locator
    readonly contactUsButton: Locator
    
    readonly logoutButton: Locator
    readonly deleteAccountButton: Locator
    readonly accountDeletedMessage: Locator
    
    constructor(page: Page) {
        this.page = page
        
        this.header = page.locator('#header')
        this.homeButton         = this.header.getByRole('link', { name: 'Home', exact: false })
        this.productsButton     = this.header.getByRole('link', { name: 'Products', exact: false })
        this.cartButton         = this.header.getByRole('link', { name: 'Cart', exact: false })
        this.signupLoginButton  = this.header.getByRole('link', { name: 'Signup / Login', exact: false })
        this.testCasesButton    = this.header.getByRole('link', { name: 'Test Cases', exact: false })
        this.contactUsButton    = this.header.getByRole('link', { name: 'Contact us', exact: false })
        
        this.logoutButton           = this.header.getByRole('link', { name: 'Logout', exact: false })
        this.deleteAccountButton    = this.header.getByRole('link', { name: 'Delete Account' })
        this.accountDeletedMessage  = page.getByTestId('account-deleted')
        this.loggedInUser           = page.locator('.nav >> b')
    }
    
    
    // Navigation
    async gotoHome() {
        await this.homeButton.click()
    }
    
    async gotoProducts() {
        await this.productsButton.click()
        return new ProductsPage(this.page)
    }
    
    async gotoCart() {
        await this.cartButton.click()
        //return new CartPage(this.page)
    }
    
    async gotoSignup() {
        await this.signupLoginButton.click()
        return new SignupPage(this.page)
    }
    
    async gotoLogin() {
        await this.signupLoginButton.click()
        return new LoginPage(this.page)
    }
    
    async gotoContactUs() {
        await this.contactUsButton.click()
        return new ContactUsPage(this.page)
    }
    
    async gotoTestCases() {
        await this.testCasesButton.click()
    }
    
    
    // Logged in user
    async logout() {
        await this.logoutButton.click()
    }
    
    async deleteAccount() {
        await this.deleteAccountButton.click()
        return new AccountDeletedPage(this.page)
    }
}