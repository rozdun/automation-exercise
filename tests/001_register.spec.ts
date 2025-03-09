import { test, expect } from './fixtures/test.ts'
import { NavigationBar } from './pages/navigationBar.ts'
import { testUser_correctLogin, testUser_signup } from './test-data/test-data.ts'


/*
    Helper function to generate a unique user for signup tests.
    Ensures each test runs with a fresh email to prevent conflicts.
*/
const generateUserData = () => ({
    ...testUser_signup,
    email: `rozdun_${Date.now()}@email.com`
})


test('Register User', async ({ page }) => {
    const userData = generateUserData()
    const navigationBar = new NavigationBar(page)
    
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