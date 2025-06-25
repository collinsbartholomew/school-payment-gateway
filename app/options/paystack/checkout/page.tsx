'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Script from 'next/script';
import { useSearchParams, useRouter } from 'next/navigation';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import Slash from '../../../components/Slash';

export default function CheckoutPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	
	// Read params from URL
	const emailParam = searchParams.get('email');
	const amountParam = searchParams.get('amount');
	
	// Local state
	const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
	const [message, setMessage] = useState('');
	
	// If required params are missing, send them back home
	useEffect(() => {
		if (!emailParam || !amountParam) {
			router.replace('/');
		}
	}, [emailParam, amountParam, router]);
	
	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setStatus('pending');
		setMessage('');
		
		try {
			// Call your init API with the dynamic params
			const res = await fetch('/api/paystack/init/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: emailParam,
					amount: Number(amountParam),
				}),
			});
			
			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || 'Payment initialization failed');
			}
			
			const data = await res.json();
			
			// Ensure the Paystack script is loaded
			if (!(window as any).PaystackPop) {
				throw new Error('Paystack script not loaded');
			}
			
			const handler = (window as any).PaystackPop.setup
				? (window as any).PaystackPop.setup({
					key: data.access_code,
					email: emailParam,
					amount: Number(amountParam) * 100, // kobo
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
					onClose: () => {
						setStatus('idle');
						setMessage('Payment canceled.');
					},
				})
				: null;
			
			if (!handler) throw new Error('Unable to initialize Paystack handler');
			
			handler.openIframe(data.access_code);
		} catch (err: any) {
			setStatus('error');
			setMessage(err.message);
		}
	};
	
	return (
		<div className="min-h-screen bg-gray-900 flex items-center justify-center">
			<Header />
			<Slash />
			<div className="flex items-center justify-center px-4 z-10">
				<Script src="https://js.paystack.co/v2/inline.js" strategy="afterInteractive" />
				<div className="flex flex-col gap-10 w-full px-8 py-20 shadow rounded-md backdrop-blur-3xl bg-white/10">
					<h2 className="text-xl font-bold mb-4 text-blue-200">Checkout – One‐Time Payment</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-200">
								Email Address
							</label>
							<input
								id="email"
								type="email"
								required
								value={emailParam || ''}
								className="input cursor-not-allowed mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
								readOnly
								disabled
							/>
						</div>
						<div>
							<p className="text-sm text-gray-200">
								Amount: <strong>₦{amountParam}</strong>
							</p>
						</div>
						<Button type="submit" disabled={status === 'pending'}>
							{status === 'pending' ? 'Processing...' : `Pay ₦${amountParam}`}
						</Button>
					</form>
					
					{status !== 'idle' && (
						<p className={`mt-4 text-center ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
							{message}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
