import './globals.css'
import HomePageForm from "./components/HomePageForm";
import Header from "./components/Header";
import Slash from "./components/Slash"

export const metadata = {
	title: "Paystack Checkout - School Payment Gateway",
	description: "Secure payment checkout for school fees using Paystack",
};

export default function Home() {
	return (
		<main className="min-h-screen relative bg-gray-900 flex items-center justify-center overflow-hidden">
			<Header/>
			<Slash/>
			<HomePageForm/>
		</main>
	)
}
