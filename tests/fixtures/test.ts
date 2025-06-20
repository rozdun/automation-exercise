import { test as base, Page, TestType } from '@playwright/test'
import { NavigationBar } from '../components/NavigationBar'
import { CartModal } from '../components/CartModal'
import { CheckoutModal } from '../components/CheckoutModal'
import { ProductFiltersSidebar } from '../components/ProductFiltersSidebar'
import { ScrollUpButton } from '../components/ScrollUpButton'
import { Footer } from '../components/Footer'
import { Flows } from '../utils/Flows'

type Fixtures = {
  page: Page,
  flows: Flows,
  navigationBar: NavigationBar,
  cartModal: CartModal,
  checkoutModal: CheckoutModal,
  productFiltersSidebar: ProductFiltersSidebar,
  scrollUpButton: ScrollUpButton,
  footer: Footer,
}

export const test: TestType<Fixtures, object> = base.extend<Fixtures>({
    page: async ({ page }, use) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' })
        
        await use(page)
    },
    
    flows: async ({ page }, use)                    => await use(new Flows(page)),
    footer: async ({ page }, use)                   => await use(new Footer(page)),
    scrollUpButton: async ({ page }, use)           => await use(new ScrollUpButton(page)),
    navigationBar: async ({ page }, use)            => await use(new NavigationBar(page)),
    cartModal: async ({ page }, use)                => await use(new CartModal(page)),
    checkoutModal: async ({ page }, use)            => await use(new CheckoutModal(page)),
    productFiltersSidebar: async ({ page }, use)    => await use(new ProductFiltersSidebar(page)),
})

export { expect } from '@playwright/test'


