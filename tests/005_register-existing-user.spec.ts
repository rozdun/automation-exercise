import { test, expect } from './fixtures/test.ts'
import { NavigationBar } from './pages/navigationBar.ts'
import { testUser_correctLogin } from './test-data/test-data.ts'

test('Register User with existing email', async ({ page }) => {
    const navigationBar = new NavigationBar(page)
    
    const signupPage = await navigationBar.gotoSignup()
    await expect(signupPage.signupHeading).toBeVisible()
    
    // Attempt signup
    await signupPage.signup(testUser_correctLogin)
    await expect(signupPage.emailExistsErrorMessage).toBeVisible()
})