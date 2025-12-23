import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import LenisProvider from '@/lib/LenisProvider';
import { CartDrawer } from '@/components/store';

// Highland Pulse Typography - Elegant Serif with Modern Sans
const playfairDisplay = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
    variable: '--font-heading',
    display: 'swap',
});

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-body',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Bellasport | Authentic Football Kits in Ethiopia',
    description:
        'Bellasport brings the passion of global and local soccer to fans in Addis Ababa. Shop authentic football kits from top clubs and customize with your name and number.',
    keywords: [
        'football kits Ethiopia',
        'soccer jerseys Addis Ababa',
        'authentic kits',
        'Bellasport',
        'custom football jerseys',
    ],
    openGraph: {
        title: 'Bellasport | Authentic Football Kits in Ethiopia',
        description:
            'Shop authentic football kits from top clubs. Customize with your name and number.',
        type: 'website',
        locale: 'en_ET',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${playfairDisplay.variable} ${inter.variable}`}
        >
            <body>
                <LenisProvider>
                    <CartDrawer />
                    {children}
                </LenisProvider>
            </body>
        </html>
    );
}
