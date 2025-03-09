import { test, expect } from './fixtures/test.ts'
import { NavigationBar } from './pages/navigationBar.ts'
import { testUser_correctLogin } from './test-data/test-data.ts'

test('Logout User', async ({ page }) => {
    const navigationBar = new NavigationBar(page)
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