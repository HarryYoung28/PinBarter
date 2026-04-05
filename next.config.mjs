/** @type {import('next').NextConfig} */
const nextConfig = {
  // config options here
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      }
    ]
  },
  allowedDevOrigins: ['192.168.1.*']
}

export default nextConfig