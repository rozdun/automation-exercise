import { test as base, Page, expect } from '@playwright/test'
import { NavigationBar } from '../pages/navigationBar'

export const test = base.extend<{ page: Page, navigationBar: NavigationBar }>({
    page: async ({ page }, use) => {
        await page.goto('')
        //await expect(page.locator('#header >> .logo')).toBeVisible()
        //
        //// Cookie consent
        //await page.getByRole('dialog')
        //          .getByRole('button', { name: 'Consent' }).click()
        
        use(page)
    },
    navigationBar: async ({ page }, use) => {
        const navigationBar = new NavigationBar(page)
        use(navigationBar)
    }
})

export { expect } from '@playwright/test'