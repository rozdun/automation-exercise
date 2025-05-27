import { test as baseTest } from '@playwright/test'
import { test, expect } from './fixtures/test'
import { ContactUsPage } from './pages/ContactUsPage'
import { Footer } from './components/Footer'
import { LoginPage } from './pages/LoginPage'
import { ProductDetailsPage } from './pages/ProductDetailsPage'
import { ProductsPage } from './pages/ProductsPage'
import { SignupPage } from './pages/SignupPage'
import { User, Product, testUser_correctLogin, testUser_incorrectLogin, testProducts, CartProduct, SearchError, Address, testPaymentDetails } from './test-data/test-data'
import { CartPage } from './pages/CartPage'
import { AccountDeletedPage } from './pages/AccountDeletedPage'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { extractPrice, generateUserData } from './utils/utils'
import { completeSignupFlow } from './utils/signup'
import { CheckoutPage } from './pages/CheckoutPage'
import { PaymentPage } from './pages/PaymentPage'
import { OrderConfirmationPage } from './pages/OrderConfirmationPage'
import { Brand, brands, categories, Category, Subcategory } from './test-data/product-filters'
import { CategoryProductsPage } from './pages/CategoryProductsPage'
import { BrandProductsPage } from './pages/BrandProductsPage'

const __filename: string = fileURLToPath(import.meta.url)
const __dirname: string = dirname(__filename)
const storagePath: string = resolve(__dirname, 'test-data/gdpr.json')
baseTest.use({
    storageState: storagePath
})
console.log("Loading storage state from: ", storagePath)



test('1. Register User', async ({ page, navigationBar }) => {
    const user: User = generateUserData()
    await completeSignupFlow(navigationBar, user)
    
    await test.step("Delete Account", async () => {
        const accountDeletedPage: AccountDeletedPage = await navigationBar.deleteAccount()
        await expect(navigationBar.accountDeletedMessage).toBeVisible()
        
        await accountDeletedPage.continueToHome()
        await expect(page).toHaveURL('')
    })
})


test('2. Login User with correct email and password', async ({ navigationBar }) => {
    const loginPage: LoginPage = await navigationBar.gotoLogin()
    await expect(loginPage.loginHeading).toBeVisible()
    
    // Perform login
    await loginPage.login(testUser_correctLogin)
    await expect(navigationBar.loggedInUser).toHaveText(testUser_correctLogin.name)
})


test('3. Login User with incorrect email and password', async ({ navigationBar }) => {
    const loginPage: LoginPage = await navigationBar.gotoLogin()
    await expect(loginPage.loginHeading).toBeVisible()
    
    // Attempt login
    await loginPage.login(testUser_incorrectLogin)
    await expect(loginPage.invalidLoginErrorMessage).toBeVisible()
})


test('4. Logout User', async ({ page, navigationBar }) => {
    const loginPage: LoginPage = await navigationBar.gotoLogin()
    await expect(loginPage.loginHeading).toBeVisible()
    
    // Perform login
    await loginPage.login(testUser_correctLogin)
    await expect(navigationBar.loggedInUser).toHaveText(testUser_correctLogin.name)
    
    // Logout
    await navigationBar.logout()
    await expect(page).toHaveURL('/login')
    await expect(navigationBar.signupLoginButton).toBeVisible()
})


test('5. Register User with existing email', async ({ navigationBar }) => {
    const signupPage: SignupPage = await navigationBar.gotoSignup()
    await expect(signupPage.signupHeading).toBeVisible()
    
    // Attempt signup
    await signupPage.signup(testUser_correctLogin)
    await expect(signupPage.emailExistsErrorMessage).toBeVisible()
})


test('6. Contact Us Form', async ({ page, navigationBar }) => {
    const contactUsPage: ContactUsPage = await navigationBar.gotoContactUs()
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
    const productsPage: ProductsPage = await navigationBar.gotoProducts()
    await expect(page).toHaveURL('/products')
    
    const product: Product = testProducts.blueTop
    const productDetailsPage: ProductDetailsPage = await productsPage.viewProduct(product)
    const productDetails: Product = await productDetailsPage.getProductDetails()
    expect(productDetails).toEqual({
        id: product.id,
        name: product.name,
        category: 'Category: ' + product.category,
        price: product.price,
        availability: product.availability,
        condition: product.condition,
        brand: product.brand,
    })
})


test.describe('9. Search Products', () => {
    const products: string[] = ['jeans', 'tshirt', 't-shirt', 'top']
    
    products.forEach((searchTerm) => {
        test(`Search for "${searchTerm}"`, async ({ page, navigationBar }) => {
            const productsPage: ProductsPage = await navigationBar.gotoProducts()
            await expect(page).toHaveURL('/products')
            
            await productsPage.searchProduct(searchTerm)
            await expect(productsPage.searchedProductsHeader).toBeVisible()
            
            const incorrectSearchResults: SearchError[] = await productsPage.findIncorrectSearchResults(searchTerm)
            if (incorrectSearchResults.length > 0)
                throw Error('Incorrect product search results:\n' + JSON.stringify(incorrectSearchResults, null, ' '))
        })
    })
})


test('10. Verify Subscription in home page', async ({ page }) => {
    const user: User = generateUserData()
    
    const footer: Footer = new Footer(page)
    await expect(footer.subscriptionHeader).toBeVisible()
    
    await footer.subscribeToNewsletter(user)
    await expect(footer.subscriptionSuccessMessage).toBeVisible()
})


test('11: Verify Subscription in Cart page', async ({ page, navigationBar }) => {
    const user: User = generateUserData()
    const cartPage: CartPage = await navigationBar.gotoCart()
    await expect(cartPage.cartItems).toBeVisible()
    
    const footer: Footer = new Footer(page)
    await expect(footer.subscriptionHeader).toBeVisible()
    
    await footer.subscribeToNewsletter(user)
    await expect(footer.subscriptionSuccessMessage).toBeVisible()
})


test('12: Add Products in Cart', async ({ navigationBar, cartModal }) => {
    const productsPage: ProductsPage = await navigationBar.gotoProducts()
    
    await productsPage.addProductToCart(testProducts.blueTop)
    await cartModal.continueShopping()
    
    await productsPage.addProductToCart(testProducts.winterTop)
    await cartModal.continueShopping()
    
    await productsPage.addProductToCart(testProducts.winterTop)
    const cartPage: CartPage = await cartModal.viewCart()
    await expect(cartPage.cartItems).toBeVisible()
    
    const cartProductsList: CartProduct[] = await cartPage.getCartProducts()
    const winterTopTotal: number = 2 * extractPrice(testProducts.winterTop.price)
    
    expect(cartProductsList[0]).toStrictEqual({
        name:     testProducts.blueTop.name,
        category: testProducts.blueTop.category,
        price:    testProducts.blueTop.price,
        quantity: '1',
        total:    testProducts.blueTop.price,
    })
    expect(cartProductsList[1]).toStrictEqual({
        name:     testProducts.winterTop.name,
        category: testProducts.winterTop.category,
        price:    testProducts.winterTop.price,
        quantity: '2',
        total:    'Rs. ' + winterTopTotal.toString(),
    })
})


test('13: Verify Product quantity in Cart', async ({ page, cartModal }) => {
    const productsPage: ProductsPage = new ProductsPage(page)
    const productDetailsPage: ProductDetailsPage =  await productsPage.viewProduct(testProducts.winterTop)
    const productCountAdded: number = 4
    await productDetailsPage.setAmount(productCountAdded)
    
    await productDetailsPage.addToCart()
    const cartPage: CartPage = await cartModal.viewCart()
    await expect(cartPage.cartItems).toBeVisible()
    
    const cartProductsList: CartProduct[] = await cartPage.getCartProducts()
    const winterTopTotal: number = productCountAdded * extractPrice(testProducts.winterTop.price)
    
    expect(cartProductsList).toStrictEqual([{
        name:     testProducts.winterTop.name,
        category: testProducts.winterTop.category,
        price:    testProducts.winterTop.price,
        quantity: productCountAdded.toString(),
        total:    'Rs. ' + winterTopTotal.toString(),
    }])
})


test('14: Place Order: Register while Checkout', async ({ navigationBar, cartModal, checkoutModal }) => {
    const productsPage: ProductsPage = await navigationBar.gotoProducts()
    await productsPage.addProductToCart(testProducts.blueTop)
    await cartModal.continueShopping()
    
    await productsPage.addProductToCart(testProducts.winterTop)
    let cartPage: CartPage = await cartModal.viewCart()
    await expect(cartPage.cartItems).toBeVisible()
    
    await cartPage.proceedToCheckout()
    await checkoutModal.proceedToSignup()
    
    const user: User = generateUserData()
    await completeSignupFlow(navigationBar, user)
    
    cartPage = await navigationBar.gotoCart()
    const checkoutPage: CheckoutPage = await cartPage.proceedToCheckout()
    const address: Address = await checkoutPage.getDeliveryAddress()
    expect(address).toStrictEqual({
        fullName:       user.title + '. ' + user.firstname + ' ' + user.lastname,
        company:        user.company,
        address1:       user.address1,
        address2:       user.address2,
        fullLocation:   user.city + ' ' + user.state + ' ' + user.zipcode,
        country:        user.country,
        mobile_number:  user.mobile_number,
    })
    
    const cartProducts: CartProduct[] = await checkoutPage.getCartProducts()
    expect(cartProducts).toStrictEqual([{
        name:      testProducts.blueTop.name,
        category:  testProducts.blueTop.category,
        price:     testProducts.blueTop.price,
        quantity:  '1',
        total:     testProducts.blueTop.price,
    },{
        name:      testProducts.winterTop.name,
        category:  testProducts.winterTop.category,
        price:     testProducts.winterTop.price,
        quantity:  '1',
        total:     testProducts.winterTop.price,
    }])
    
    const totalPrice: string = await checkoutPage.getTotalPrice()
    const summedPrice: number = extractPrice(testProducts.blueTop.price) + extractPrice(testProducts.winterTop.price)
    expect(extractPrice(totalPrice)).toEqual(summedPrice)
    
    
    const orderComment: string = 'test comment ' + new Date().toISOString()
    await checkoutPage.addOrderComment(orderComment)
    
    const paymentPage: PaymentPage = await checkoutPage.placeOrder()
    await paymentPage.enterPaymentDetails(testPaymentDetails)
    
    const orderConfirmationPage: OrderConfirmationPage = await paymentPage.payAndConfirmOrder()
    await expect(orderConfirmationPage.orderPlacedHeading).toContainText('Order Placed!')
    
    await test.step("Delete Account", async () => {
        const accountDeletedPage: AccountDeletedPage = await navigationBar.deleteAccount()
        await expect(navigationBar.accountDeletedMessage).toBeVisible()
        
        await accountDeletedPage.continueToHome()
    })
})


test('15: Place Order: Register before Checkout', async ({ navigationBar, cartModal }) => {
    const user: User = generateUserData()
    await completeSignupFlow(navigationBar, user)
    
    const productsPage: ProductsPage = await navigationBar.gotoProducts()
    await productsPage.addProductToCart(testProducts.blueTop)
    
    const cartPage: CartPage = await cartModal.viewCart()
    await expect(cartPage.cartItems).toBeVisible()
    
    const checkoutPage: CheckoutPage = await cartPage.proceedToCheckout()
    const address: Address = await checkoutPage.getDeliveryAddress()
    expect(address).toStrictEqual({
        fullName:       user.title + '. ' + user.firstname + ' ' + user.lastname,
        company:        user.company,
        address1:       user.address1,
        address2:       user.address2,
        fullLocation:   user.city + ' ' + user.state + ' ' + user.zipcode,
        country:        user.country,
        mobile_number:  user.mobile_number,
    })
    
    const orderComment: string = 'test comment ' + new Date().toISOString()
    await checkoutPage.addOrderComment(orderComment)
    
    const paymentPage: PaymentPage = await checkoutPage.placeOrder()
    await paymentPage.enterPaymentDetails(testPaymentDetails)
    
    const orderConfirmationPage: OrderConfirmationPage = await paymentPage.payAndConfirmOrder()
    await expect(orderConfirmationPage.orderPlacedHeading).toHaveText('Order Placed!')
    
    await test.step("Delete Account", async () => {
        const accountDeletedPage: AccountDeletedPage = await navigationBar.deleteAccount()
        await expect(navigationBar.accountDeletedMessage).toBeVisible()
        
        await accountDeletedPage.continueToHome()
    })
})


test('16: Place Order: Login before Checkout', async ({ navigationBar, cartModal }) => {
    const loginPage: LoginPage = await navigationBar.gotoLogin()
    await expect(loginPage.loginHeading).toBeVisible()
    
    const user: User = testUser_correctLogin
    await loginPage.login(user)
    console.log(user.password)
    await expect(navigationBar.loggedInUser).toHaveText(user.name)
    
    const productsPage: ProductsPage = await navigationBar.gotoProducts()
    await productsPage.addProductToCart(testProducts.blueTop)
    
    const cartPage: CartPage = await cartModal.viewCart()
    await expect(cartPage.cartItems).toBeVisible()
    
    const checkoutPage: CheckoutPage = await cartPage.proceedToCheckout()
    const address: Address = await checkoutPage.getDeliveryAddress()
    expect(address).toStrictEqual({
        fullName:       user.title + '. ' + user.firstname + ' ' + user.lastname,
        company:        user.company,
        address1:       user.address1,
        address2:       user.address2,
        fullLocation:   user.city + ' ' + user.state + ' ' + user.zipcode,
        country:        user.country,
        mobile_number:  user.mobile_number,
    })
    
    const orderComment: string = 'test comment ' + new Date().toISOString()
    await checkoutPage.addOrderComment(orderComment)
    
    const paymentPage: PaymentPage = await checkoutPage.placeOrder()
    await paymentPage.enterPaymentDetails(testPaymentDetails)
    
    const orderConfirmationPage: OrderConfirmationPage = await paymentPage.payAndConfirmOrder()
    await expect(orderConfirmationPage.orderPlacedHeading).toHaveText('Order Placed!')
    
    await test.step("Delete Account", async () => {
        const accountDeletedPage: AccountDeletedPage = await navigationBar.deleteAccount()
        await expect(navigationBar.accountDeletedMessage).toBeVisible()
        
        await accountDeletedPage.continueToHome()
    })
})


test('17: Remove Products From Cart', async ({ navigationBar, cartModal }) => {
    const productsPage: ProductsPage = await navigationBar.gotoProducts()
    await productsPage.addProductToCart(testProducts.blueTop)
    
    const cartPage: CartPage = await cartModal.viewCart()
    const productsBeforeRemove: number = await cartPage.cartProductRows.count()
    expect(productsBeforeRemove).toEqual(1)
    
    await cartPage.removeProduct(0)
    await expect(cartPage.cartIsEmptySection).toBeVisible()
    await expect(cartPage.cartProductRows).not.toBeVisible()
})


test('18: View Category Products', async ({ productFiltersSidebar }) => {
    let category: Category = categories.Women
    let subcategory: Subcategory = category.products.Dress
    
    const categoryProductsPage: CategoryProductsPage = await productFiltersSidebar.setCategory(category, subcategory)
    await expect(categoryProductsPage.categoryProductsHeader).toHaveText(`${category.name} - ${subcategory} Products`)
    
    
    category = categories.Men
    subcategory = category.products.Tshirts
    
    await productFiltersSidebar.setCategory(category, subcategory)
    await expect(categoryProductsPage.categoryProductsHeader).toHaveText(`${category.name} - ${subcategory} Products`)
})


test('19: View & Cart Brand Products', async ({ navigationBar, productFiltersSidebar }) => {
    let brand: Brand = brands.AllenSollyJunior
    
    await navigationBar.gotoProducts()
    
    const brandProductsPage: BrandProductsPage = await productFiltersSidebar.setBrand(brand)
    await expect(brandProductsPage.categoryProductsHeader).toHaveText(`Brand - ${brand} Products`)
    
    
    brand = brands.Babyhug
    
    await productFiltersSidebar.setBrand(brand)
    await expect(brandProductsPage.categoryProductsHeader).toHaveText(`Brand - ${brand} Products`)
})