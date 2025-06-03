import { Locator, Page } from "@playwright/test"
import { Address, CartProduct } from "../test-data/test-data"
import { CartTable } from "../components/CartTable"
import { PaymentPage } from "./PaymentPage"


export class CheckoutPage {
    private readonly addressDetailsSection: Locator
    private readonly deliveryAddress: Locator
    private readonly billingAddress: Locator
    
    private readonly cartProductsTable: Locator
    readonly cartTotalPrice: Locator
    
    private readonly orderCommentInput: Locator
    private readonly placeOrderButton: Locator
    
    constructor(private readonly page: Page) {
        this.addressDetailsSection = this.page.getByTestId('checkout-info')
        this.deliveryAddress = this.addressDetailsSection.locator('#address_delivery')
        this.billingAddress = this.addressDetailsSection.locator('#address_invoice')
        
        this.cartProductsTable = this.page.locator('#cart_info >> tbody >> tr')
        this.cartTotalPrice = this.cartProductsTable.last().locator('.cart_total_price')
        
        this.orderCommentInput = this.page.locator('#ordermsg').getByRole('textbox')
        this.placeOrderButton = this.page.getByRole('link', { name: 'Place Order' })
    }
    
    
    async getDeliveryAddress(): Promise<Address> {
        return {
            fullName:       await this.deliveryAddress.locator('.address_firstname').innerText(), // title, firstname, lastname
            company:        await this.deliveryAddress.locator('.address_address1').nth(0).innerText(),
            address1:       await this.deliveryAddress.locator('.address_address1').nth(1).innerText(),
            address2:       await this.deliveryAddress.locator('.address_address1').nth(2).innerText(),
            fullLocation:   await this.deliveryAddress.locator('.address_city').innerText(), // city, state, zipcode
            country:        await this.deliveryAddress.locator('.address_country_name').innerText(),
            mobile_number:  await this.deliveryAddress.locator('.address_phone').innerText(),
        }
    }
    
    async getBillingAddress(): Promise<Address> {
        return {
            fullName:       await this.billingAddress.locator('.address_firstname').innerText(), // title, firstname, lastname
            company:        await this.billingAddress.locator('.address_address1').nth(0).innerText(),
            address1:       await this.billingAddress.locator('.address_address1').nth(1).innerText(),
            address2:       await this.billingAddress.locator('.address_address1').nth(2).innerText(),
            fullLocation:   await this.billingAddress.locator('.address_city').innerText(), // city, state, zipcode
            country:        await this.billingAddress.locator('.address_country_name').innerText(),
            mobile_number:  await this.billingAddress.locator('.address_phone').innerText(),
        }
    }
    
    
    async getCartProducts(): Promise<CartProduct[]> {
        return await new CartTable(this.cartProductsTable).getProducts(true)
    }
    
    async getTotalPrice(): Promise<string> {
        return await this.cartTotalPrice.innerText()
    }
    
    async addOrderComment(text: string): Promise<void> {
        await this.orderCommentInput.fill(text)
    }
    
    async placeOrder(): Promise<PaymentPage> {
        await this.placeOrderButton.click()
        
        return new PaymentPage(this.page)
    }
}