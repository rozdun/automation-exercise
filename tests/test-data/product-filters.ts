// eslint-disable-next-line @typescript-eslint/typedef
export const categories = {
    Women: {
        name: 'Women',
        products: {
            Dress: 'Dress',
            Tops: 'Tops',
            Saree: 'Saree'
        },
    },
    Men: {
        name: 'Men',
        products: {
            Tshirts: 'Tshirts',
            Jeans: 'Jeans'
        },
    },
    Kids: {
        name: 'Kids',
        products: {
            Dress: 'Dress',
            TopsAndShirts: 'Tops & Shirts'
        },
    },
} as const

type AllCategories = typeof categories
export type Category = AllCategories[keyof AllCategories]
export type Subcategory = Category extends { products: infer P }    ?    P extends Record<string, string> ? P[keyof P] : never    : never



// eslint-disable-next-line @typescript-eslint/typedef
export const brands = {
    Polo: 'Polo',
    HnM: 'H&M',
    MastAndHarbour: 'Mast & Harbour',
    Babyhug: 'Babyhug',
    AllenSollyJunior: 'Allen Solly Junior',
    KookieKids: 'Kookie Kids',
    Biba: 'Biba',
} as const

export type Brand = typeof brands[keyof typeof brands]