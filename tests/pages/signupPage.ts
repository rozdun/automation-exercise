import { Locator, Page } from "@playwright/test"
import { User } from "../test-data/test-data"

export class SignupPage {
    private readonly signupSection: Locator
    readonly signupHeading: Locator
    readonly enterAccountInformationText: Locator
    readonly accountCreatedMessage: Locator
    readonly emailExistsErrorMessage: Locator
    
    constructor(private readonly page: Page) {
        this.signupSection = this.page.locator('.signup-form')
        this.signupHeading = this.signupSection.getByRole('heading', { name: 'New User Signup!' })
        this.emailExistsErrorMessage = this.signupSection.locator('p', { hasText: 'Email Address already exist!' })
        
        this.enterAccountInformationText = this.page.locator('.login-form >> b', { hasText: 'Enter Account Information' })
        this.accountCreatedMessage = this.page.getByTestId('account-created')
    }
    
    
    async signup(user: User): Promise<void> {
        await this.page.getByTestId('signup-name').fill(user.name)
        await this.page.getByTestId('signup-email').fill(user.email)
        await this.page.getByTestId('signup-button').click()
    }
    
    async fillRegistrationForm(user: User): Promise<void> {
        await this.page.getByLabel(user.title + '.').check()
        
        await this.page.getByTestId('password').fill(user.password)
        
        await this.page.getByTestId('days').selectOption(user.birth_day)
        await this.page.getByTestId('months').selectOption(user.birth_month)
        await this.page.getByTestId('years').selectOption(user.birth_year)
        
        if (user.subscribe_newsletter)  await this.page.locator('#newsletter').check()
        if (user.receive_offers)        await this.page.locator('#optin').check()
        
        await this.page.getByTestId('first_name').fill(user.firstname)
        await this.page.getByTestId('last_name').fill(user.lastname)
        await this.page.getByTestId('company').fill(user.company)
        
        await this.page.getByTestId('address').fill(user.address1)
        await this.page.getByTestId('address2').fill(user.address2)
        await this.page.getByTestId('country').selectOption(user.country)
        await this.page.getByTestId('state').fill(user.state)
        await this.page.getByTestId('city').fill(user.city)
        await this.page.getByTestId('zipcode').fill(user.zipcode)
        
        await this.page.getByTestId('mobile_number').fill(user.mobile_number)
        
        await this.page.getByRole('button', { name: 'Create Account' }).click()
    }
    
    async completeRegistration(): Promise<void> {
        await this.page.getByTestId('continue-button').click()
    }
}