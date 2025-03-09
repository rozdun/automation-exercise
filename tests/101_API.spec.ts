import { test, expect } from '@playwright/test'
import { testUser_correctLogin, testUser_incorrectLogin, testUser_signup } from './test-data/test-data'

/*
    This API uses "responseCode" instead of standard HTTP status codes, 
    hence why jsonResponse.responseCode is used instead of response.status().
*/


/*
    Helper function to generate a unique user for signup tests.
    Ensures each test runs with a fresh email to prevent conflicts.
*/
const generateUserData = () => ({
    ...testUser_signup,
    email: `rozdun_${Date.now()}@email.com`
})



test('API 1: Get All Products List', async ({ request }) => {
    const response = await request.get('/api/productsList')
    const jsonResponse = await response.json()
    
    expect(jsonResponse.responseCode).toEqual(200)
    expect(jsonResponse).toHaveProperty('products')
    expect(Array.isArray(jsonResponse.products)).toBeTruthy()
    
    for (const product of jsonResponse.products) {
        expect(product).toHaveProperty('id')
        expect(product).toHaveProperty('name')
        expect(product).toHaveProperty('price')
        expect(product).toHaveProperty('brand')
        expect(product).toHaveProperty('category')
        
        expect(typeof product.id).toBe('number')
        expect(typeof product.name).toBe('string')
        expect(typeof product.price).toBe('string')
        expect(typeof product.brand).toBe('string')
        expect(typeof product.category).toBe('object')
    }
})


test('API 2: POST To All Products List', async ({ request }) => {
    const response = await request.post('/api/productsList')
    const jsonResponse = await response.json()
    
    expect(jsonResponse.responseCode).toEqual(405)
    expect(jsonResponse.message).toBe('This request method is not supported.')
})


test('API 3: Get All Brands List', async ({ request }) => {
    const response = await request.get('/api/brandsList')
    const jsonResponse = await response.json()
    
    expect(jsonResponse.responseCode).toEqual(200)
    expect(jsonResponse).toHaveProperty('brands')
    expect(Array.isArray(jsonResponse.brands)).toBeTruthy()
})


test('API 4: PUT To All Brands List', async ({ request }) => {
    const response = await request.put('/api/brandsList')
    const jsonResponse = await response.json()
    
    expect(jsonResponse.responseCode).toEqual(405)
    expect(jsonResponse.message).toBe('This request method is not supported.')
})


test.describe('API 5: POST To Search Product', () => {
    const products = ['top', 'tshirt', 'jeans']
    
    products.forEach(product => {
        test(`Search for "${product}"`, async ({ request }) => {
            const response = await request.post('/api/searchProduct', {
                form: { search_product: product }
            })
            const jsonResponse = await response.json()
            expect(jsonResponse.responseCode).toEqual(200)
            expect(jsonResponse.products.length).toBeGreaterThan(0)
            
            // Ensure all returned products match the search term
            const mismatchedProducts = jsonResponse.products.filter(item => {
                const category = item.category.category.toLowerCase()
                const name = item.name.toLowerCase()
                const searchTerm = product.toLowerCase()
                return !(category.includes(searchTerm) || name.includes(searchTerm))
            })
            
            expect(mismatchedProducts.length).toBe(0)
        })
    })
})


test('API 6: POST To Search Product without search_product parameter', async ({ request }) => {
    const response = await request.post('/api/searchProduct', {
        form: {  }
    })
    const jsonResponse = await response.json()
    
    expect(jsonResponse.responseCode).toEqual(400)
    expect(jsonResponse.message).toBe('Bad request, search_product parameter is missing in POST request.')
})


/*
    Login tests covering valid, invalid, and missing credentials
*/
test('API 7: POST To Verify Login with valid details', async ({ request }) => {
    const response = await request.post('/api/verifyLogin', {
        form: { 
            email: testUser_correctLogin.email,
            password: testUser_correctLogin.password,
        }
    })
    const jsonResponse = await response.json()
    
    expect(jsonResponse.responseCode).toEqual(200)
    expect(jsonResponse.message).toBe('User exists!')
})


test('API 8: POST To Verify Login without email parameter', async ({ request }) => {
    const response = await request.post('/api/verifyLogin', {
        form: { 
            password: testUser_correctLogin.password,
        }
    })
    const jsonResponse = await response.json()
    
    expect(jsonResponse.responseCode).toEqual(400)
    expect(jsonResponse.message).toBe('Bad request, email or password parameter is missing in POST request.')
})


test('API 9: DELETE To Verify Login', async ({ request }) => {
    const response = await request.delete('/api/verifyLogin')
    const jsonResponse = await response.json()
    
    expect(jsonResponse.responseCode).toEqual(405)
    expect(jsonResponse.message).toBe('This request method is not supported.')
})


test('API 10: POST To Verify Login with invalid details', async ({ request }) => {
    const response = await request.post('/api/verifyLogin', {
        form: {
            email: testUser_incorrectLogin.email,
            password: testUser_incorrectLogin.password,
        }
    })
    const jsonResponse = await response.json()
    
    expect(jsonResponse.responseCode).toEqual(404)
    expect(jsonResponse.message).toBe('User not found!')
})


/*
    User account tests (Signup & Deletion)
*/
test('API 11: POST To Create/Register User Account', async ({ request }) => {
    const userData = generateUserData()
    const response = await request.post('/api/createAccount', {
        form: userData
    })
    const jsonResponse = await response.json()
    
    expect(jsonResponse.responseCode).toEqual(201)
    expect(jsonResponse.message).toBe('User created!')
})


test('API 12: DELETE METHOD To Delete User Account', async ({ request }) => {
    const userData = generateUserData()
    await request.post('/api/createAccount', {
        form: userData
    })
    
    const response = await request.delete('/api/deleteAccount', {
        form: userData
    })
    const jsonResponse = await response.json()
    
    expect(jsonResponse.responseCode).toEqual(200)
    expect(jsonResponse.message).toBe('Account deleted!')
})


test('API 13: PUT METHOD To Update User Account', async ({ request }) => {
    const userData = generateUserData()
    await request.post('/api/createAccount', {
        form: userData
    })
    
    const response = await request.put('/api/updateAccount', {
        form: userData
    })
    const jsonResponse = await response.json()
    
    expect(jsonResponse.responseCode).toEqual(200)
    expect(jsonResponse.message).toBe('User updated!')
})


test('API 14: GET user account detail by email', async ({ request }) => {
    const email = testUser_correctLogin.email
    const response = await request.get(`/api/getUserDetailByEmail?email=${email}`)
    const jsonResponse = await response.json()
    
    expect(jsonResponse.responseCode).toEqual(200)
    expect(jsonResponse).toHaveProperty('user')
    const user = jsonResponse.user

    // Validate user details match the expected data
    expect(user).toHaveProperty('id', testUser_correctLogin.id)
    expect(user).toHaveProperty('name', testUser_correctLogin.name)
    expect(user).toHaveProperty('email', testUser_correctLogin.email)
    expect(user).toHaveProperty('title', testUser_correctLogin.title)
    expect(user).toHaveProperty('birth_day', testUser_correctLogin.birth_day)
    expect(user).toHaveProperty('birth_month', testUser_correctLogin.birth_month)
    expect(user).toHaveProperty('birth_year', testUser_correctLogin.birth_year)
    expect(user).toHaveProperty('first_name', testUser_correctLogin.firstname)
    expect(user).toHaveProperty('last_name', testUser_correctLogin.lastname)
    expect(user).toHaveProperty('company', testUser_correctLogin.company)
    expect(user).toHaveProperty('address1', testUser_correctLogin.address1)
    expect(user).toHaveProperty('address2', testUser_correctLogin.address2)
    expect(user).toHaveProperty('country', testUser_correctLogin.country)
    expect(user).toHaveProperty('state', testUser_correctLogin.state)
    expect(user).toHaveProperty('city', testUser_correctLogin.city)
    expect(user).toHaveProperty('zipcode', testUser_correctLogin.zipcode)
    expect(user).toHaveProperty('mobile_number', testUser_correctLogin.mobile_number)
})