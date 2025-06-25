// app/subscription/PaymentForm.tsx
'use client'

import { useState } from 'react';
import Script from 'next/script';
import Button from '../../../components/Button';

export default function SubscriptionPage() {
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
	const [message, setMessage] = useState('');
	const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!;
	const planCode = process.env.NEXT_PUBLIC_PAYSTACK_PLAN_CODE!; // predefined plan code
	
	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus('pending');
		setMessage('');
		try {
			// Optionally ensure subscription plan/customer exists on the server
			const init = await fetch('/api/paystack/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			});
			if (!init.ok) throw new Error('Subscription setup failed');
			// Now open Paystack checkout with plan code for recurring payment
			const handler = (window as any).PaystackPop?.setup({
				key: publicKey,
				email,
				plan: planCode,      // Paystack will charge and subscribe the customer
				currency: 'NGN',
				onSuccess: async (response: any) => {
					// Verify the subscription payment on server
					const verifyRes = await fetch('/api/paystack/verify', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ reference: response.reference }),
					});
					const verifyData = await verifyRes.json();
					if (verifyData.status === 'success') {
						setStatus('success');
						setMessage('Subscription successful! Reference: ' + response.reference);
					} else {
						setStatus('error');
						setMessage('Subscription verification failed.');
					}
				},
				onClose: () => {
					setStatus('idle');
					setMessage('Subscription canceled.');
				},
			});
			handler.openIframe();
		} catch (err: any) {
			setStatus('error');
			setMessage(err.message || 'An error occurred.');
		}
	};
	
	return (
		<div className="min-h-screen flex items-center justify-center bg-sky-100 py-12 px-4">
			<Script src="https://js.paystack.co/v2/inline.js" strategy="afterInteractive" />
			<div className="w-full max-w-md bg-white p-8 shadow rounded-md">
				<h2 className="text-2xl font-bold mb-4 text-blue-800">Subscription – Monthly Plan</h2>
				<form onSubmit={handleSubscribe} className="space-y-4">
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">
							Email Address
						</label>
						<input
							id="email"
							type="email"
							required
							value={email}
							onChange={e => setEmail(e.target.value)}
							className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="you@example.com"
						/>
					</div>
					<Button type="submit" disabled={status === 'pending'}>
						{status === 'pending' ? 'Processing...' : 'Subscribe (Pay ₦5,000)'}
					</Button>
				</form>
				{status !== 'idle' && (
					<p className={`mt-4 text-center ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
						{message}
					</p>
				)}
			</div>
		</div>
	);
}
