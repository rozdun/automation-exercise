import { Locator } from '@playwright/test'
import { test, expect } from './fixtures/test'
import { Footer } from './pages/Footer'
import { NavigationBar } from './pages/NavigationBar'
import { ProductDetailsPage } from './pages/ProductDetailsPage'
import { testUser_correctLogin, testUser_incorrectLogin, testUser_signup, testProducts } from './test-data/test-data'
import path from 'path'



/*
    Helper function to generate a unique user for signup tests.
    Ensures each test runs with a fresh email to prevent conflicts.
*/
const generateUserData = () => ({
    ...testUser_signup,
    email: `rozdun_${Date.now()}@email.com`
})



const storagePath = path.resolve(__dirname, 'test-data/gdpr.json')
console.log("Loading storage state from: ", storagePath)
test.use({
    storageState: storagePath
})



test('1. Register User', async ({ page, navigationBar }) => {
    const userData = generateUserData()
    
    await test.step('Navigate to Signup Page', async () => {
        const signupPage = await navigationBar.gotoSignup()
        await expect(signupPage.signupHeading).toBeVisible()
        
        // Perform signup
        await signupPage.signup(userData)
        await expect(signupPage.enterAccountInformationText).toBeVisible()
        
        // Fill registration details
        await signupPage.fillRegistrationForm(userData)
        await expect(signupPage.accountCreatedMessage).toBeVisible()
        
        // Complete registration
        await signupPage.completeRegistration()
        await expect(navigationBar.loggedInUser).toHaveText(userData.name)
    })
    
    await test.step("Delete Account", async () => {
        const accountDeletedPage = await navigationBar.deleteAccount()
        await expect(navigationBar.accountDeletedMessage).toBeVisible()
        
        await accountDeletedPage.continueToHome()
        await expect(page).toHaveURL('')
    })
})


test('2. Login User with correct email and password', async ({ navigationBar }) => {
    const loginPage = await navigationBar.gotoLogin()
    await expect(loginPage.loginHeading).toBeVisible()
    
    // Perform login
    await loginPage.login(testUser_correctLogin)
    await expect(navigationBar.loggedInUser).toHaveText(testUser_correctLogin.name)
})


test('3. Login User with incorrect email and password', async ({ navigationBar }) => {
    const loginPage = await navigationBar.gotoLogin()
    await expect(loginPage.loginHeading).toBeVisible()
    
    // Attempt login
    await loginPage.login(testUser_incorrectLogin)
    await expect(loginPage.invalidLoginErrorMessage).toBeVisible()
})


test('4. Logout User', async ({ page, navigationBar }) => {
    const loginPage = await navigationBar.gotoLogin()
    await expect(loginPage.loginHeading).toBeVisible()
    
    // Perform login
    await loginPage.login(testUser_correctLogin)
    await expect(navigationBar.loggedInUser).toHaveText(testUser_correctLogin.name)
    
    // Logout
    await navigationBar.logout()
    await expect(page).toHaveURL('/login')
    await expect(navigationBar.signupLoginButton).toBeVisible()
})


test('5. Register User with existing email', async ({ page, navigationBar }) => {
    const signupPage = await navigationBar.gotoSignup()
    await expect(signupPage.signupHeading).toBeVisible()
    
    // Attempt signup
    await signupPage.signup(testUser_correctLogin)
    await expect(signupPage.emailExistsErrorMessage).toBeVisible()
})


test('6. Contact Us Form', async ({ page, navigationBar }) => {
    const contactUsPage = await navigationBar.gotoContactUs()
    await expect(contactUsPage.getInTouchHeading).toBeVisible()
    
    await contactUsPage.fillContactForm()
    await contactUsPage.submitMessage()
    await expect(contactUsPage.messageSentMessage).toBeVisible({ timeout: 10000 })
    
    await contactUsPage.returnHome()
    await expect(page).toHaveURL('')
    await expect(navigationBar.signupLoginButton).toBeVisible()
})


test('7. Verify Test Cases Page', async ({ page, navigationBar }) => {
    await navigationBar.gotoTestCases()
    await expect(page).toHaveURL('/test_cases')
})


test('8. Verify All Products and product detail page', async ({ page, navigationBar }) => {
    const productsPage = await navigationBar.gotoProducts()
    await expect(page).toHaveURL('/products')
    
    const product = testProducts.blueTop
    const productDetailsPage = await productsPage.viewProduct(0)
    const productDetails = await productDetailsPage.getProductDetails()
    expect(productDetails).toStrictEqual({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        availability: product.availability,
        condition: product.condition,
        brand: product.brand,
    })
})


test.describe('9. Search Product', () => {
    const products = ['jeans', 'tshirt', 't-shirt', 'top']
    const normalizeText = (text: string) => text.toLowerCase().replace(/[-_\s]/g, '')
    
    products.forEach(searchTerm => {
        test(`Search for "${searchTerm}"`, async ({ page, navigationBar, context }) => {
            const productsPage = await navigationBar.gotoProducts()
            await expect(page).toHaveURL('/products')
            
            await productsPage.searchProduct(searchTerm)
            await expect(productsPage.searchedProductsHeader).toBeVisible()
            
            const allProducts = await productsPage.allProducts.all()
            const incorrectSearchResults: { 
                href?: string
                name: string
                expected: string
                category?: string
                other?: string
            }[] = []
            
            await Promise.all(
                allProducts.map(async product => {
                    const { href, productName }  = await productsPage.getProductInfo(product)
                    const name = normalizeText(productName)
                    const searchTermNormalized = normalizeText(searchTerm)
                    
                    // Check whether the product name contains the search term
                    // If not, open the product in a new tab and check the category as well
                    if (!name.includes(searchTermNormalized)) {
                        if (!href) {
                            incorrectSearchResults.push({
                                expected: searchTerm,
                                name: productName,
                                other: 'href not found'
                            })
                        }
                        else {
                            // Open a new tab
                            const newPage = await context.newPage()
                            await newPage.goto(href ?? '', { waitUntil: 'domcontentloaded' })
                            
                            // Asssign the product details page
                            const productPage = new ProductDetailsPage(newPage)
                            const productPageDetails = await productPage.getProductDetails()
                            
                            const category = normalizeText(productPageDetails.category)
                            
                            if (!category.includes(searchTermNormalized)) {
                                incorrectSearchResults.push({
                                    href,
                                    expected: searchTerm,
                                    name: productPageDetails.name,
                                    category: productPageDetails.category
                                })
                            }
                            
                            await newPage.close()
                        }
                    }
                })
            )
            
            if (incorrectSearchResults.length > 0)
                throw Error(
                    'Incorrect product search results:\n' + JSON.stringify(incorrectSearchResults, null, ' ')
                )
        })
    })
})


test('10. Verify Subscription in home page', async ({ page }) => {
    const userData = generateUserData()
    
    const footer = new Footer(page)
    await expect(footer.subscriptionHeader).toBeVisible()
    
    await footer.subscribeToNewsletter(userData)
    await expect(footer.subscriptionSuccessMessage).toBeVisible()
})


test('11: Verify Subscription in Cart page', async ({ page, navigationBar }) => {
    const userData = generateUserData()
    const cartPage = await navigationBar.gotoCart()
    await expect(cartPage.cartItems).toBeVisible()
    
    const footer = new Footer(page)
    await expect(footer.subscriptionHeader).toBeVisible()
    
    await footer.subscribeToNewsletter(userData)
    await expect(footer.subscriptionSuccessMessage).toBeVisible()
})


test('12: Add Products in Cart', async ({ page, navigationBar }) => {
    const productsPage = await navigationBar.gotoProducts()
    await productsPage.addProductToCart(0)
    await productsPage.continueShopping()
    await productsPage.addProductToCart(1)
    
    const cartPage = await productsPage.viewCart()
    
    
})

