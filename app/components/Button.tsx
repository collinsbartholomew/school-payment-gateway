// components/Button.tsx
'use client';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

/** Reusable styled button */
export default function Button({ children, ...props }: ButtonProps) {
	return (
		<button
			className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
			{...props}
		>
			{children}
		</button>
	);
}
