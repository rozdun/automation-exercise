import test, { expect, Page } from "@playwright/test"
import { SignupPage } from "../pages/SignupPage"
import { NavigationBar } from "../components/NavigationBar"
import { User } from "../test-data/test-data"
import { AccountDeletedPage } from "../pages/AccountDeletedPage"



export class Flows {
    constructor(private readonly page: Page) {}
    
    
    /**
     * Completes the signup flow by navigating to the signup page, filling out the form,
     * and completing the registration process.
     * 
     * @param navigationBar - The navigation bar component to use for navigation.
     * @param user - The user data to fill in the signup form.
     */
    async registerAccount(navigationBar: NavigationBar, user: User): Promise<void> {
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
    
    
    /**
     * Deletes the user account.
     * 
     * @param navigationBar - The navigation bar component to use for navigation.
     */
    async deleteAccount(navigationBar: NavigationBar): Promise<void> {
        await test.step("Delete Account", async () => {
            const accountDeletedPage: AccountDeletedPage = await navigationBar.deleteAccount()
            await expect(navigationBar.accountDeletedMessage).toBeVisible()
            
            await accountDeletedPage.continueToHome()
        })
    }
}