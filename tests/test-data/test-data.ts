import { faker } from '@faker-js/faker'

export type User = { 
    id: number
    name: string
    email: string
    password: string
    title: 'Mr' | 'Mrs'
    birth_day: string
    birth_month: string
    birth_year: string
    subscribe_newsletter: boolean,
    receive_offers: boolean,
    firstname: string
    lastname: string
    company: string
    address1: string
    address2: string
    country: string
    state: string
    city: string
    zipcode: string
    mobile_number: string
}

export const testUser_correctLogin: User = { 
    id: 599120,
    name: 'rozdun_correct_login',
    email: 'rozdun_correct_email@rozdun.com',
    password: 'SecurePass123!',
    title: 'Mr',
    birth_day: '15',
    birth_month: '8',
    birth_year: '1995',
    subscribe_newsletter: false,
    receive_offers: false,
    firstname: "Michael",
    lastname: "Smith",
    company: "Tech Solutions Ltd.",
    address1: "456 Elm Street",
    address2: "Suite 101",
    country: "Canada",
    state: "Ontario",
    city: "Toronto",
    zipcode: "M5G 1Z4",
    mobile_number: "987654321",
}

export const testUser_incorrectLogin: User = {
    ...testUser_correctLogin,
    email: 'rozdun_correct_email@rozdun.com',
    password: 'rozdun_incorrect_password',
}


const firstname: string = faker.person.firstName()
const lastname: string = faker.person.lastName()

export const testUser_signup: Omit<User, 'email'> = {
    id: 123456,
    name: `${firstname} ${lastname}`,
    
    title: faker.helpers.arrayElement(['Mr', 'Mrs']),
    password: faker.internet.password({ length: 12, memorable: true }),
    birth_day: faker.number.int({ min: 1, max: 28 }).toString(),
    birth_month: faker.number.int({ min: 1, max: 12 }).toString(),
    birth_year: faker.number.int({ min: 1970, max: 2005 }).toString(),
    subscribe_newsletter: faker.datatype.boolean(),
    receive_offers: faker.datatype.boolean(),
    firstname: firstname,
    lastname: lastname,
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: faker.helpers.arrayElement(['India', 'United States', 'Canada', 'Australia', 'Israel', 'New Zealand', 'Singapore']),
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode(),
    mobile_number: faker.phone.number({ style: 'international' }),
}

export type Address = Pick<User, 'company' | 'address1' | 'address2' | 'country' | 'mobile_number'> & {
    fullName: string
    fullLocation: string
}


export type PaymentDetails = {
    nameOnCard: string
    cardNumber: string
    cvc: string
    expirationMonth: string
    expirationYear: string
}

export const testPaymentDetails: PaymentDetails = {
    nameOnCard: faker.person.fullName(),
    cardNumber: faker.finance.creditCardNumber(),
    cvc: faker.finance.creditCardCVV(),
    expirationMonth: faker.number.int({ min: 1, max: 12 }).toString(),
    expirationYear: faker.number.int({ min: 2026, max: 2030 }).toString(),
}


export type Product = {
    id: string
    name: string
    price: string
    availability: string
    category?: string
    condition?: string
    brand?: string
    order?: number
    image?: string
}

export type ProductData = {
    [key: string]: Product
}

export const testProducts: ProductData = {
    blueTop: {
        order: 0,
        id: '1',
        image: '/get_product_picture/1',
        name: 'Blue Top',
        category: 'Women > Tops',
        price: 'Rs. 500',
        availability: 'Availability: In Stock',
        condition: 'Condition: New',
        brand: 'Brand: Polo',
    },
    winterTop: {
        order: 4,
        id: '5',
        image: '/get_product_picture/5',
        name: 'Winter Top',
        category: 'Women > Tops',
        price: 'Rs. 600',
        availability: 'Availability: In Stock',
        condition: 'Condition: New',
        brand: 'Brand: Mast & Harbour',
    },
}


export type CartProduct = {
    name: string
    category: string
    price: string
    quantity: string
    total: string
}



export type SearchError = {
  href?: string
  name: string
  expected: string
  category?: string
  other?: string
}





export type APIProduct = {
    id: number
    name: string
    price: string
    brand: string
    category: {
        usetype: {
            usertype: string
        }
        category: string
    }
}

export type Brand = {
    id: number
    brand: string
}

export type ResponseJson = {
    responseCode: number
    message: string
}

export type ResponseJsonProducts = ResponseJson & {
    products: APIProduct[]
}

export type ResponseJsonBrands = ResponseJson & {
    brands: Brand[]
}

export type ResponseJsonUser = ResponseJson & {
    user: User
}



