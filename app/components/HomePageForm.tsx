'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaShieldAlt, FaHandshake } from 'react-icons/fa';

export default function HomePageForm() {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !email.includes('@')) {
			alert('Please enter a valid email address');
			return;
		}
		
		setLoading(true);
		try {
			const res = await fetch('/api/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ email }),
			});
			const result = await res.json();
			if (!res.ok) throw new Error(result.error || 'Login failed');
			router.push('/payment-form');
		} catch (err: any) {
			alert(err.message || 'An error occurred');
		} finally {
			setLoading(false);
		}
	};
	
	return (
		<section className="z-5 self-center w-full h-100 mx-5 px-5 py-10 rounded-xl border border-gray-200 text-center backdrop-blur-3xl">
			<form onSubmit={handleSubmit} className="relative flex flex-col justify-center gap-10 items-center w-full h-full">
				<h2 aria-live="polite" className="absolute top-5 font-bold uppercase text-sm">
					Your payments are end-to-end secured
				</h2>
				
				<div className="flex gap-5 items-center justify-center mt-10">
					<FaHandshake className="w-10 h-10 lg:w-20 aspect-square rounded-xl text-blue-900" />
					<FaShieldAlt className="w-10 h-10 lg:w-20 aspect-square rounded-xl text-blue-900" />
				</div>
				
				<label htmlFor="email" className="text-sm font-medium tracking-widest text-white capitalize">
					Input your email address
				</label>
				<input
					type="email"
					id="email"
					autoFocus
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={loading}
					className="w-full h-8 outline-1 outline-gray-300/30 px-5 rounded-full text-center text-gray-600"
				/>
				
				<button
					type="submit"
					disabled={loading}
					className="absolute bottom-0 w-[50%] bg-blue-600 p-1 rounded-full text-lg font-bold text-gray-200 drop-shadow-sm disabled:opacity-60"
				>
					{loading ? 'Logging in...' : 'Submit'}
				</button>
			</form>
		</section>
	);
}
