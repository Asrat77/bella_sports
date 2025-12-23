export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    league: string;
    image: string;
    backImage?: string;
    isNew?: boolean;
    isBestSeller?: boolean;
}

export const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Ethiopian Coffee Home 24/25',
        price: 3500,
        category: 'Ethiopian Premier League',
        league: 'Ethiopian Premier',
        image: '/images/kits/addis-home.jpg',
        backImage: '/images/kits/back-side-red.jpg',
        isNew: true,
    },
    {
        id: '2',
        name: 'St. George FC Home 24/25',
        price: 3500,
        category: 'Ethiopian Premier League',
        league: 'Ethiopian Premier',
        image: '/images/kits/st-george-home.jpg',
        backImage: '/images/kits/back-side-red.jpg',
        isBestSeller: true,
    },
    {
        id: '4',
        name: 'Manchester United Home 24/25',
        price: 4500,
        category: 'Premier League',
        league: 'Premier League',
        image: '/images/kits/man-utd-home.jpg',
        backImage: '/images/kits/back-side-red.jpg',
        isNew: true,
    },
    {
        id: '5',
        name: 'Arsenal Home 24/25',
        price: 4500,
        category: 'Premier League',
        league: 'Premier League',
        image: '/images/kits/arsenal-home.jpg',
        backImage: '/images/kits/back-side-red.jpg',
        isBestSeller: true,
    },
    {
        id: '6',
        name: 'Real Madrid Home 24/25',
        price: 4800,
        category: 'La Liga',
        league: 'La Liga',
        image: '/images/kits/real-madrid-home.jpg',
        backImage: '/images/kits/back-side-red.jpg',
    },
    {
        id: '7',
        name: 'Barcelona Home 24/25',
        price: 4800,
        category: 'La Liga',
        league: 'La Liga',
        image: '/images/kits/barca-home.jpg',
        backImage: '/images/kits/back-side-red.jpg',
    },
    {
        id: '8',
        name: 'Ethiopian National Team Home',
        price: 3200,
        category: 'National Teams',
        league: 'National',
        image: '/images/kits/ethiopia-home.jpg',
        backImage: '/images/kits/back-side-red.jpg',
        isBestSeller: true,
    },
];
