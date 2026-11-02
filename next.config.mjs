/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        agentFeedback: true,
    },

    reactCompiler: true,

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "i.ibb.co",
            },
            {
                protocol: "https",
                hostname: "www.vacationstravel.com",
            },
        ],
    },

    turbopack: {
        rules: {
            "*.css": {
                loaders: ["@tailwindcss/turbopack"],
                as: "*.css",
            },
        },
    },
};

export default nextConfig;