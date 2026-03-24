/** @type {import('next').NextConfig} */

module.exports = {
	reactStrictMode: true,
	compress: true,
	productionBrowserSourceMaps: false,
	env: {
		NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
	},
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					// Security Headers
					{ key: 'X-Frame-Options', value: 'DENY' },
					{ key: 'X-Content-Type-Options', value: 'nosniff' },
					{ key: 'X-XSS-Protection', value: '1; mode=block' },
					{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
					{
						key: 'Content-Security-Policy',
						value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.paystack.co https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; font-src 'self'; connect-src 'self' https://api.paystack.co https://api.paypal.com; img-src 'self' data: https:; frame-src https://checkout.paystack.com;"
					},
					{ key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
					{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
				]
			}
		];
	},
	// Image optimization
	images: {
		formats: ['image/avif', 'image/webp'],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},
};