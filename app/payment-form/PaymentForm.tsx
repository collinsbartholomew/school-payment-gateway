'use client'

import React from'react'
import Header from '../components/Header'
import Slash from '../components/Slash'
import PaymentPageForm from '../components/PaymentPageForm'

type Props = {}

export default function PaymentForm({}: Props) {
	return (
		<div>
			<main className="min-h-screen h-screen overflow-hidden bg-fixed bg-gray-900 flex items-center justify-center">
				<Header/>
				<Slash/>
				<PaymentPageForm/>
			</main>
		</div>
	)
}