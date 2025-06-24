'use client'

import React, { useState} from 'react'
import Link from "next/link";


type Props = {}

export   default function PaymentPageForm({}: Props){
	const [formData, setFormData] = useState({
		fullName: '',
		studentId: '',
		grade: '',
		email: '',
		phone: '',
		dob: '',
		session: '',
		consent: false,
	});
	
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === 'checkbox' ? checked : value
		});
	};
	
	const handleSubmit = (e) => {
		e.preventDefault();
		// Trigger verification logic or call API
		console.log('Submitting verification form:', formData);
	};
	
	return (
		<div className={`z-10 self-center h-130 min-h-[80vh] w-full mx-5 px-5 py-5 mt-10 md:mt-50 -mx-auto rounded-xl border-1 border-gray-200 items-center justify-center overflow-y-scroll text-center backdrop-blur-3xl`}>
			<form
				onSubmit={handleSubmit}
				className="max-w-2xl mx-auto py-6 bg-blue/50 rounded-2xl space-y-6"
			>
				<h2 className="text-2xl font-semibold text-gray-300">Student Verification</h2>
				
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<input
						type="text"
						name="fullName"
						placeholder="Full Name"
						value={formData.fullName}
						onChange={handleChange}
						required
						className="input"
					/>
					<input
						type="text"
						name="studentId"
						placeholder="Student ID / Matric Number"
						value={formData.studentId}
						onChange={handleChange}
						required
						className="input"
					/>
					<input
						type="text"
						name="grade"
						placeholder="Class / Grade"
						value={formData.grade}
						onChange={handleChange}
						required
						className="input"
					/>
					<input
						type="email"
						name="email"
						placeholder="Email Address"
						value={formData.email}
						onChange={handleChange}
						required
						className="input"
					/>
					<input
						type="tel"
						name="phone"
						placeholder="Phone Number"
						value={formData.phone}
						onChange={handleChange}
						required
						className="input"
					/>
					<input
						type="date"
						name="dob"
						placeholder="Date of Birth"
						value={formData.dob}
						onChange={handleChange}
						className="input"
					/>
					<input
						type="text"
						name="session"
						placeholder="Academic Session (e.g. 2024/2025)"
						value={formData.session}
						onChange={handleChange}
						required
						className="input"
					/>
					<input
						type="text"
						name="term"
						placeholder="Term (e.g. First Term)"
						value={formData.term}
						onChange={handleChange}
						required
						className="input"
					/>
				</div>
				<div>
					<h3 className={`font-bold text-white py-3 text-xl`}>Payment Options</h3>
					<div className={`flex flex-col gap-3`}>
						<label
							className={`flex gap-2 relative w-full text-center items-center justify-start border-1 rounded-full px-5 border-gray-300`}
							htmlFor={`school_fees`}>
							<input type="checkbox" name={`school_fees`} id={`school_fees`} value={`school_fees`}/>
							<h3 className={`inline-block text-blue-200 font-medium`}>
								School Fees</h3>
							<span className={`absolute right-8 text-gray-400 pl-10 border-l-2 font-bold`}>₦25,500</span>
						</label>
						<label
							className={`flex gap-2 relative w-full text-center items-center justify-start border-1 rounded-full px-5 border-gray-300`}
							htmlFor={`hostel_fees`}>
							<input type="checkbox" name={`hostel_fees`} id={`hostel_fees`} value={`hostel_fees`}/>
							<h3 className={`inline-block text-blue-200 font-medium`}>
								Hostel Fees</h3>
							<span className={`absolute right-8 text-gray-400 pl-10 border-l-2 font-bold`}>₦30,000</span>
						</label>
						<label
							className={`flex gap-2 relative w-full text-center items-center justify-start border-1 rounded-full px-5 border-gray-300`}
							htmlFor={`lesson_fees`}>
							<input type="checkbox" name={`lesson_fees`} id={`lesson_fees`} value={`lesson_fees`}/>
							<h3 className={`inline-block text-blue-200 font-medium`}>
								Lesson Fees</h3>
							<span className={`absolute right-8 text-gray-400 pl-10 border-l-2 font-bold`}>₦10,000</span>
						</label>
						<label
							className={`flex gap-2 relative w-full text-center items-center justify-start border-1 rounded-full px-5 border-gray-300`}
							htmlFor={`graduation_fees`}>
							<input type="checkbox" name={`graduation_fees`} id={`graduation_fees`} value={`graduation_fees`}/>
							<h3 className={`inline-block text-blue-200 font-medium`}>
								Graduation Fees</h3>
							<span className={`absolute right-8 text-gray-400 pl-10 border-l-2 font-bold`}>₦26,500</span>
						</label>
					</div>
				</div>
				
				<label htmlFor={`consent`} className="flex items-center justify-center w-full">
					<span className="text-sm text-gray-400 flex gap-3 items-start text-start">
						<input
							type="checkbox"
							name="consent"
							id={`consent`}
							checked={formData.consent}
							onChange={handleChange}
							required
						/>
						<p>I confirm the above information is accurate.</p>
		        </span>
				</label>
				
				<Link href={`/options/paystack/checkout`}>
					<button
						type="submit"
						className="py-1 px-8 bg-blue-700 text-blue-300 font-bold rounded-xl hover:bg-blue-800 transition"
					>
						Proceed to Payment
					</button>
				</Link>
			</form>
		</div>
		
	)
}
