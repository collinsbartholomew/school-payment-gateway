import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import PaymentForm from '../components/PaymentForm';

export default async function PaymentFormPage() {
	const token = (await cookies()).get('token')?.value;
	if (!token) return redirect('/');
	
	try {
		const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
		const user = await prisma.user.findUnique({
			where: { id },
			include: { payments: true, subscriptions: true },
		});
		if (!user) return redirect('/');
		
		return <PaymentForm user={user} />;
	} catch (err) {
		console.error('Auth error:', err);
		return redirect('/');
	}
}
