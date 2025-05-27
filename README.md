🚧 Work in Progress 🚧

Playwright E2E and API tests for https://automationexercise.com/.

## E2E Test Cases

| #  | Test Case Description                              |
|----|----------------------------------------------------|
| 1  | Register User                                      |
| 2  | Login User with correct email and password         |
| 3  | Login User with incorrect email and password       |
| 4  | Logout User                                        |
| 5  | Register User with existing email                  |
| 6  | Contact Us Form                                    |
| 7  | Verify Test Cases Page                             |
| 8  | Verify All Products and product detail page        |
| 9  | Search Product                                     |
| 10 | Verify Subscription in home page                   |
| 11 | Verify Subscription in Cart page                   |
| 12 | Add Products in Cart                               |
| 13 | Verify Product quantity in Cart                    |
| 14 | Place Order: Register while Checkout               |
| 15 | Place Order: Register before Checkout              |
| 16 | Place Order: Login before Checkout                 |
| 17 | Remove Products From Cart                          |
| 18 | View Category Products                             |
| 19 | View & Cart Brand Products                         |

## API Test Cases

| #  | Test Case Description                                      |
|----|------------------------------------------------------------|
| 1  | Get All Products List                                      |
| 2  | POST To All Products List                                  |
| 3  | Get All Brands List                                        |
| 4  | PUT To All Brands List                                     |
| 5  | POST To Search Product                                     |
| 6  | POST To Search Product without `search_product` parameter  |
| 7  | POST To Verify Login with valid details                    |
| 8  | POST To Verify Login without `email` parameter             |
| 9  | DELETE To Verify Login                                     |
| 10 | POST To Verify Login with invalid details                  |
| 11 | POST To Create/Register User Account                       |
| 12 | DELETE To Delete User Account                              |
| 13 | PUT To Update User Account                                 |
| 14 | GET User Account Detail by Email                           |
