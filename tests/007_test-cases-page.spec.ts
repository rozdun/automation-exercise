import { test, expect } from './fixtures/test.ts'
import { NavigationBar } from './pages/navigationBar.ts'

test('Verify Test Cases Page', async ({ page }) => {
    const navigationBar = new NavigationBar(page)
    
    await navigationBar.gotoTestCases()
    await expect(page).toHaveURL('/test_cases')
})