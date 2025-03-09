import { test, expect } from './fixtures/test.ts'
import { NavigationBar } from './pages/navigationBar.ts'

test('Contact Us Form', async ({ page }) => {
    const navigationBar = new NavigationBar(page)
    
    const contactUsPage = await navigationBar.gotoContactUs()
    await expect(contactUsPage.getInTouchHeading).toBeVisible()
    
    await contactUsPage.fillContactForm() 
    await contactUsPage.submitMessage()
    await expect(contactUsPage.messageSentMessage).toBeVisible()
    
    await contactUsPage.returnHome()
    await expect(page).toHaveURL('')
    await expect(navigationBar.signupLoginButton).toBeVisible()
})