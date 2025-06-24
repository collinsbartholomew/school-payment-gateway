'use client'

import { useState } from 'react';
import Script from 'next/script';
import Button from '../../../components/Button';

export default function CheckoutPage() {
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
	const [message, setMessage] = useState(''); // public key (no secret here)
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus('pending');
		setMessage('');
		try {
			const res = await fetch('/api/paystack/init/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, amount: 5000 }),
			});
			
			if (!res.ok) {
				throw new Error('Payment initialization failed');
			}
			
			const data = await res.json();
			
			if (!(window as any).PaystackPop) {
				throw new Error('Paystack script not loaded');
			}
			
			const handler = new (window as any).PaystackPop({
				key: data.access_code,
				email: email,
				amount: 500000, // Remember: the amount is usually in the smallest currency unit (kobo)
				onSuccess: async (response: any) => {
					const verifyRes = await fetch('/api/paystack/verify', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ reference: response.reference }),
					});
					
					const verifyData = await verifyRes.json();
					
					if (verifyData.status === 'success') {
						setStatus('success');
						setMessage('Payment successful! Reference: ' + response.reference);
					} else {
						setStatus('error');
						setMessage('Payment verification failed.');
					}
				},
				
				onAbandoned: () => {
					setStatus('idle');
					setMessage('Payment canceled.');
				},
			});
			
			console.log(data.key)
			
			handler.resumeTransaction(data.access_code);
			
		} catch (err: any) {
			console.log(err);
			setStatus('error');
			setMessage(err.message || 'An error occurred.');
		}
	};
	
	
	return (
		<div className="min-h-screen flex items-center justify-center bg-sky-100 py-12 px-4">
			{/* Load Paystack inline JS (v2) */}
			<Script src="https://js.paystack.co/v2/inline.js" strategy="afterInteractive" />
			<div className="w-full max-w-md bg-white p-8 shadow rounded-md">
				<h2 className="text-2xl font-bold mb-4 text-blue-800">Checkout – One-Time Payment</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
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
						{status === 'pending' ? 'Processing...' : 'Pay ₦5,000'}
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
