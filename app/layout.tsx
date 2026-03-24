import type {Metadata, Viewport} from "next";
import "./globals.css";


export const metadata: Metadata = {
	title: {
		default: "Payment Gateway for Schools",
		template: "%s | School Payment Gateway",
	},
	description: "Secure school payment processing with Paystack. Fast, reliable, and easy to use payment gateway for school fees, hostel, and graduation payments.",
	keywords: ["school payments", "education fees", "payment gateway", "paystack", "secure payments"],
	authors: [{ name: "School Payment Gateway Team" }],
	creator: "Payment Gateway Team",
	publisher: "School Payment Solutions",
	openGraph: {
		type: "website",
		locale: "en_NG",
		url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
		title: "Payment Gateway for Schools",
		description: "Secure school payment processing with Paystack",
		siteName: "School Payment Gateway",
	},
	twitter: {
		card: "summary_large_image",
		title: "Payment Gateway for Schools",
		description: "Secure school payment processing",
	},
	robots: {
		index: true,
		follow: true,
		"max-image-preview": "large",
		"max-snippet": -1,
		"max-video-preview": -1,
	},
	formatDetection: {
		email: true,
		telephone: true,
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	userScalable: true,
	themeColor: "#000000",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
		<head>
			<meta charSet="utf-8" />
			<meta httpEquiv="x-ua-compatible" content="ie=edge" />
			<link rel="canonical" href={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"} />
		</head>
		<body className="antialiased">
		{children}
		</body>
		</html>
	);
}
