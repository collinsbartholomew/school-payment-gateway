import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '../../../lib/prisma';
import logger from '../../../lib/logger';

const InitSchema = z.object({
	email: z.string().email(),
	amount: z.number().positive(),
	currency: z.string().default('NGN'),
	subaccount: z.string().optional(),
});

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { email, amount, currency, subaccount } = InitSchema.parse(body);
		
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) throw new Error('Invalid user');
		
		const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				amount: amount * 100,
				currency,
				...(subaccount && { subaccount }),
			}),
		});
		
		const paystackData = await paystackRes.json();
		
		if (!paystackData.status) {
			throw new Error(paystackData.message || 'Payment initialization failed');
		}
		
		const { reference } = paystackData.data;
		
		return NextResponse.json({ reference });
	} catch (error: any) {
		logger.error(`Init Transaction Error: ${error.message}`);
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}
