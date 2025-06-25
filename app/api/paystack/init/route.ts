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
		
		console.log(InitSchema.parse(body))
		
		let user = await prisma.user.findUnique({ where: { email } });
		
		if (!user) {
			user = await prisma.user.create({ data: { email } });
		}
		
		const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				amount: amount * 100, // Paystack expects amount in kobo
				currency,
				...(subaccount && { subaccount }),
			}),
		})
		
		const paystackData = await paystackRes.json()
		
		if (!paystackData.status) {
			throw new Error(paystackData.message || 'Payment initialization failed')
		}
		
		const { authorization_url, reference, access_code } = paystackData.data
		
		await prisma.payment.create({
			data: {
				userId: user.id,
				amount: amount * 100,
				reference,
				status: 'pending',
			},
		});
		
		logger.info(`Initialized transaction for user ${user.id}, reference ${reference}`)
		
		return NextResponse.json({ authorization_url, reference, access_code });
		
	} catch (error: any) {
		logger.error(`Init Transaction Error: ${error.message}`);
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}
