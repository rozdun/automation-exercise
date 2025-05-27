import { Locator, Page } from "@playwright/test"
import { PaymentDetails } from "../test-data/test-data"
import { OrderConfirmationPage } from "./OrderConfirmationPage"


export class PaymentPage {
    private readonly paymentSection: Locator
    private readonly nameOnCardInput: Locator
    private readonly cartNumberInput: Locator
    private readonly cvcInput: Locator
    private readonly expirationMonthInput: Locator
    private readonly expirationYearInput: Locator
    
    private readonly payAndConfirmButton: Locator
    
    constructor(private readonly page: Page) {
        this.paymentSection       = this.page.locator('.payment-information')
        this.nameOnCardInput      = this.paymentSection.getByTestId('name-on-card')
        this.cartNumberInput      = this.paymentSection.getByTestId('card-number')
        this.cvcInput             = this.paymentSection.getByTestId('cvc')
        this.expirationMonthInput = this.paymentSection.getByTestId('expiry-month')
        this.expirationYearInput  = this.paymentSection.getByTestId('expiry-year')
        
        this.payAndConfirmButton = this.paymentSection.getByTestId('pay-button')
    }
    
    
    async enterPaymentDetails(paymentDetails: PaymentDetails): Promise<void>{
        await this.nameOnCardInput.fill(paymentDetails.nameOnCard)
        await this.cartNumberInput.fill(paymentDetails.cardNumber)
        await this.cvcInput.fill(paymentDetails.cvc)
        await this.expirationMonthInput.fill(paymentDetails.expirationMonth)
        await this.expirationYearInput.fill(paymentDetails.expirationYear)
    }
    
    async payAndConfirmOrder(): Promise<OrderConfirmationPage> {
        await this.payAndConfirmButton.click()
        
        return new OrderConfirmationPage(this.page)
    }
}