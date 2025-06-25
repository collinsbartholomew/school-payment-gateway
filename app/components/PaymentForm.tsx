'use client';

import React from 'react';
import Header from './Header';
import Slash from './Slash';
import PaymentPageForm from './PaymentPageForm';

type Props = {
	user: React.ComponentProps<typeof PaymentPageForm>['user'];
};

export default function PaymentForm({ user }: Props) {
	return (
		<main className="min-h-screen bg-gray-900 flex items-center justify-center">
			<Header />
			<Slash />
			<PaymentPageForm user={user} />
		</main>
	);
}
