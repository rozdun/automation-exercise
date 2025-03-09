import { faker } from '@faker-js/faker'

export const testUser_correctLogin = { 
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

export const testUser_incorrectLogin = {
    email: 'rozdun_incorrect_email@rozdun.com',
    password: 'rozdun_password',
}

export const testUser_signup = {
    name: faker.person.firstName(),
    // Email should be created dynamically in the test

    title: faker.helpers.arrayElement(['Mr', 'Mrs']),
    password: faker.internet.password({ length: 12, memorable: true }),
    birth_day: faker.number.int({ min: 1, max: 28 }).toString(),
    birth_month: faker.number.int({ min: 1, max: 12 }).toString(),
    birth_year: faker.number.int({ min: 1970, max: 2005 }).toString(),
    subscribe_newsletter: faker.datatype.boolean(),
    receive_offers: faker.datatype.boolean(),
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: faker.helpers.arrayElement(['India', 'United States', 'Canada', 'Australia', 'Israel', 'New Zealand', 'Singapore']),
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode(),
    mobile_number: faker.phone.number({ style: 'international' }),
}




export const testProduct_BlueTop = {
    id: 1,
    name: 'Blue Top',
    category: 'Women > Tops',
    price: 'Rs. 500',
    availability: 'In Stock',
    condition: 'New',
    brand: 'Polo',
}