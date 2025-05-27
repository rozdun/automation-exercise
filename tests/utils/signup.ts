import test, { expect } from "@playwright/test"
import { SignupPage } from "../pages/SignupPage"
import { NavigationBar } from "../components/NavigationBar"
import { User } from "../test-data/test-data"

export async function completeSignupFlow(navigationBar: NavigationBar, user: User): Promise<void> {
    let signupPage: SignupPage
    
    await test.step('Navigate to Signup Page', async () => {
        signupPage = await navigationBar.gotoSignup()
        await expect(signupPage.signupHeading).toBeVisible()
    })
    
    await test.step('Fill Signup Form', async () => {
        await signupPage.signup(user)
        await expect(signupPage.enterAccountInformationText).toBeVisible()
    })
    
    await test.step('Complete Registration', async () => {
        await signupPage.fillRegistrationForm(user)
        await expect(signupPage.accountCreatedMessage).toBeVisible()
        
        await signupPage.completeRegistration()
        await expect(navigationBar.loggedInUser).toHaveText(user.name)
    })
}

