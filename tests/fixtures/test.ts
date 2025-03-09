import { test as base, Page, expect } from '@playwright/test'

export const test = base.extend<{ page: Page }>({
    page: async ({ page }, use) => {
        await page.goto('')
        await expect(page.locator('#header >> .logo')).toBeVisible()
        
        // Cookie consent
        await page.getByRole('dialog')
                  .getByRole('button', { name: 'Consent' }).click()
        
        use(page)
    }
})

export { expect } from '@playwright/test'