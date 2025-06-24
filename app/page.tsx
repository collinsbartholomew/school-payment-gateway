'use client'

import './globals.css'
import Head from 'next/head'
import HomePageForm from "./components/HomePageForm";
import Header from "./components/Header";
import Slash from "./components/Slash"

export default function Home() {
	return (
		<>
			<Head>
				<title>Paystack Checkout</title>
			</Head>
			
			<main className="min-h-screen bg-gray-900 flex items-center justify-center">
				<Header/>
				<Slash/>
				<HomePageForm/>
			</main>
		</>
	)
}
