import type {Metadata} from "next";
import "./globals.css";


export const metadata: Metadata = {
	title: "Payment Gateway for Schools",
	description: "Payments made easy by just the click of a button, nothing more, nothing less. Secure and super" +
		" fast. We've got you covered",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
		<body >
		{children}
		</body>
		</html>
	);
}
