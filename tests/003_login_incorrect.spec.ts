import { test, expect } from './fixtures/test.ts'
import { NavigationBar } from './pages/navigationBar.ts'
import { testUser_incorrectLogin } from './test-data/test-data.ts'

test('Login User with incorrect email and password', async ({ page }) => {
    const navigationBar = new NavigationBar(page)
    const loginPage = await navigationBar.gotoLogin()
    await expect(loginPage.loginHeading).toBeVisible()
    
    // Attempt login
    await loginPage.login(testUser_incorrectLogin)
    await expect(loginPage.invalidLoginErrorMessage).toBeVisible()
})