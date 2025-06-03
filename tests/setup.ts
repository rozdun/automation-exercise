import { test, expect }  from "./fixtures/test"
import { LoginPage } from "./pages/LoginPage"
import { CartPage } from "./pages/CartPage"
import { testUser_correctLogin, User } from "./test-data/test-data"


test('0. Register testUser_correctLogin', async ({ navigationBar, flows }) => {
    const loginPage: LoginPage = await navigationBar.gotoLogin()
    await loginPage.login(testUser_correctLogin)
    
    if (await loginPage.loginHeading.isVisible()) {
        const user: User = testUser_correctLogin
        await flows.registerAccount(navigationBar, user)
        await expect(navigationBar.loggedInUser).toHaveText(user.name)
    } else {
        const cartPage: CartPage = await navigationBar.gotoCart()
        await cartPage.clearCart()
    }
})
