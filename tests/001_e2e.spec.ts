import { test, expect } from './fixtures/test.ts'
import { Footer } from './pages/footer.ts'
import { NavigationBar } from './pages/navigationBar.ts'
import { testUser_correctLogin, testUser_incorrectLogin, testUser_signup, testProducts } from './test-data/test-data.ts'
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
    await expect(contactUsPage.messageSentMessage).toBeVisible()
    
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
    const productDetailsPage = await productsPage.viewProduct(product.id)
    await expect(page).toHaveURL('/product_details/' + product.id)
    
    await expect(productDetailsPage.productName).toContainText(product.name)
    await expect(productDetailsPage.category).toContainText(product.category)
    await expect(productDetailsPage.price).toContainText(product.price)
    await expect(productDetailsPage.availability).toContainText(product.availability)
    await expect(productDetailsPage.condition).toContainText(product.condition)
    await expect(productDetailsPage.brand).toContainText(product.brand)
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