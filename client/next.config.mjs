/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for better development experience
    reactStrictMode: true,

    // Image optimization configuration
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    async rewrites() {
        // Use environment variable with fallback to ngrok for development
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 
            (process.env.NODE_ENV === 'production' 
                ? 'https://3dcf1bf9af48.ngrok-free.app/api/:path*' 
                : 'http://127.0.0.1:3001/api/:path*');
        
        return [
            {
                source: '/api/:path*',
                destination: apiUrl,
            },
        ];
    },
};

export default nextConfig;
