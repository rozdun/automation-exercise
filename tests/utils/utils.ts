import { testUser_signup, User } from "../test-data/test-data"

export const generateUserData: () => User = (): User => ({
    ...testUser_signup,
    email: `rozdun_${new Date().toISOString().replace(/[:.]/g, '-')}@email.com`
})

export const normalizeText: (text: string) => string = (text: string) => text.toLowerCase().replace(/[-_\s]/g, '')

export const extractPrice: (price: string) => number = (price: string) => parseInt(price.replace('Rs. ', ''))