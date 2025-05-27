import { test, expect, APIResponse } from '@playwright/test'
import { User, testUser_correctLogin, testUser_incorrectLogin, ResponseJson, ResponseJsonBrands, ResponseJsonProducts, APIProduct, ResponseJsonUser } from './test-data/test-data'
import { generateUserData, normalizeText } from './utils/utils'

/*
    This API uses "responseCode" instead of standard HTTP status codes, 
    hence why responseJson.responseCode is used instead of response.status().
*/



test('API 1: Get All Products List', async ({ request }) => {
    const response: APIResponse = await request.get('/api/productsList')
    const responseJson: ResponseJsonProducts = await response.json()
    
    expect(responseJson.responseCode).toEqual(200)
    
    expect(responseJson).toHaveProperty('products')
    expect(Array.isArray(responseJson.products)).toBeTruthy()
    
    for (const product of responseJson.products) {
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
    const response: APIResponse = await request.post('/api/productsList')
    const responseJson: ResponseJson = await response.json()
    
    expect(responseJson.responseCode).toEqual(405)
    expect(responseJson.message).toBe('This request method is not supported.')
})


test('API 3: Get All Brands List', async ({ request }) => {
    const response: APIResponse = await request.get('/api/brandsList')
    const responseJson: ResponseJsonBrands = await response.json()
    
    expect(responseJson.responseCode).toEqual(200)
    expect(responseJson).toHaveProperty('brands')
    expect(Array.isArray(responseJson.brands)).toBeTruthy()
})


test('API 4: PUT To All Brands List', async ({ request }) => {
    const response: APIResponse = await request.put('/api/brandsList')
    const responseJson: ResponseJsonBrands = await response.json()
    
    expect(responseJson.responseCode).toEqual(405)
    expect(responseJson.message).toBe('This request method is not supported.')
})


test.describe('API 5: POST To Search Product', () => {
    const products: string[] = ['top', 'tshirt', 'jeans']
    
    products.forEach((product: string) => {
        test(`Search for "${product}"`, async ({ request }) => {
            const response: APIResponse = await request.post('/api/searchProduct', {
                form: { search_product: product }
            })
            const responseJson: ResponseJsonProducts = await response.json()
            expect(responseJson.responseCode).toEqual(200)
            expect(responseJson.products.length).toBeGreaterThan(0)
            
            const mismatchedProducts: {
                category: string,
                name: string,
                searchTerm: string,
            }[] = []
            
            // If the search term is not found in name or category, log it
            responseJson.products.forEach((item: APIProduct) => {
                const category: string = normalizeText(item.category.category)
                const name: string = normalizeText(item.name)
                const searchTerm: string = normalizeText(product)
                
                if (!category.includes(searchTerm) && !name.includes(searchTerm)) {
                    mismatchedProducts.push({
                        category,
                        name,
                        searchTerm,
                    })
                }
            })
            
            expect(mismatchedProducts.length).toBe(0)
        })
    })
})


test('API 6: POST To Search Product without search_product parameter', async ({ request }) => {
    const response: APIResponse = await request.post('/api/searchProduct', {
        form: {  }
    })
    const responseJson: ResponseJson = await response.json()
    
    expect(responseJson.responseCode).toEqual(400)
    expect(responseJson.message).toBe('Bad request, search_product parameter is missing in POST request.')
})


/*
    Login tests covering valid, invalid, and missing credentials
*/
test('API 7: POST To Verify Login with valid details', async ({ request }) => {
    const response: APIResponse = await request.post('/api/verifyLogin', {
        form: { 
            email: testUser_correctLogin.email,
            password: testUser_correctLogin.password,
        }
    })
    const responseJson: ResponseJson = await response.json()
    
    expect(responseJson.responseCode).toEqual(200)
    expect(responseJson.message).toBe('User exists!')
})


test('API 8: POST To Verify Login without email parameter', async ({ request }) => {
    const response: APIResponse = await request.post('/api/verifyLogin', {
        form: { 
            password: testUser_correctLogin.password,
        }
    })
    const responseJson: ResponseJson = await response.json()
    
    expect(responseJson.responseCode).toEqual(400)
    expect(responseJson.message).toBe('Bad request, email or password parameter is missing in POST request.')
})


test('API 9: DELETE To Verify Login', async ({ request }) => {
    const response: APIResponse = await request.delete('/api/verifyLogin')
    const responseJson: ResponseJson = await response.json()
    
    expect(responseJson.responseCode).toEqual(405)
    expect(responseJson.message).toBe('This request method is not supported.')
})


test('API 10: POST To Verify Login with invalid details', async ({ request }) => {
    const response: APIResponse = await request.post('/api/verifyLogin', {
        form: {
            email: testUser_incorrectLogin.email,
            password: testUser_incorrectLogin.password,
        }
    })
    const responseJson: ResponseJson = await response.json()
    
    expect(responseJson.responseCode).toEqual(404)
    expect(responseJson.message).toBe('User not found!')
})


/*
    User account tests (Signup & Deletion)
*/
test('API 11: POST To Create/Register User Account', async ({ request }) => {
    const userData: User = generateUserData()
    const response: APIResponse = await request.post('/api/createAccount', {
        form: userData
    })
    const responseJson: ResponseJson = await response.json()
    
    expect(responseJson.responseCode).toEqual(201)
    expect(responseJson.message).toBe('User created!')
})


test('API 12: DELETE METHOD To Delete User Account', async ({ request }) => {
    const userData: User = generateUserData()
    await request.post('/api/createAccount', {
        form: userData
    })
    
    const response: APIResponse = await request.delete('/api/deleteAccount', {
        form: userData
    })
    const responseJson: ResponseJson = await response.json()
    
    expect(responseJson.responseCode).toEqual(200)
    expect(responseJson.message).toBe('Account deleted!')
})


test('API 13: PUT METHOD To Update User Account', async ({ request }) => {
    const userData: User = generateUserData()
    await request.post('/api/createAccount', {
        form: userData
    })
    
    const response: APIResponse = await request.put('/api/updateAccount', {
        form: userData
    })
    const responseJson: ResponseJson = await response.json()
    
    expect(responseJson.responseCode).toEqual(200)
    expect(responseJson.message).toBe('User updated!')
})


// Fails due to missing mobile_number
test.fail('FAIL - API 14: GET user account detail by email', async ({ request }) => {
    const email: string = testUser_correctLogin.email
    const response: APIResponse = await request.get(`/api/getUserDetailByEmail?email=${email}`)
    const responseJson: ResponseJsonUser = await response.json()
    
    expect(responseJson.responseCode).toEqual(200)
    expect(responseJson).toHaveProperty('user')
    const user: User = responseJson.user

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