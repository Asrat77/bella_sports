/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    async rewrites() {
        // Only add rewrites if API URL is configured
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        if (!apiUrl) {
            return []; // No rewrites if no API URL configured
        }
        
        return [
            {
                source: '/api/:path*',
                destination: `${apiUrl}/:path*`,
            },
        ];
    },
};

export default nextConfig;