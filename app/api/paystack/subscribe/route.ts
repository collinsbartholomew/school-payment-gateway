// app/api/paystack/subscribe/route.ts
import {NextResponse} from 'next/server';
import {z} from 'zod';
import prisma from '../../../lib/prisma';
import logger from '../../../lib/logger';


const SubscribeSchema = z.object({
	email: z.string().email(),
	planName: z.string(),
	amount: z.number().positive(),
	interval: z.enum([
		'hourly',
		'daily',
		'weekly',
		'monthly',
		'quarterly',
		'biannually',
		'annually',
	]),
	invoiceLimit: z.number().min(0).optional(),
});

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const {email, planName, amount, interval, invoiceLimit} = SubscribeSchema.parse(body);
		
		// Find or create user
		let user = await prisma.user.findUnique({where: {email}});
		if (!user) {
			user = await prisma.user.create({data: {email}});
		}
		
		// Find or create plan in DB
		let plan = await prisma.plan.findFirst({where: {name: planName}});
		if (!plan) {
			// Create Paystack plan
			const planRes = await fetch('https://api.paystack.co/plan', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: planName,
					interval,
					amount: amount * 100,
					invoice_limit: invoiceLimit ?? 0,
				}),
			});
			const planData = await planRes.json();
			if (!planData.status) {
				throw new Error(planData.message || 'Plan creation failed');
			}
			const {plan_code, currency} = planData.data;
			plan = await prisma.plan.create({
				data: {
					name: planName,
					planCode: plan_code,
					amount: amount * 100,
					interval,
					currency,
					invoiceLimit: invoiceLimit ?? 0,
				},
			});
			logger.info(`Created plan ${planName} (code: ${plan_code})`);
		}
		
		// Ensure Paystack customer exists
		if (!user.paystackCustomerId) {
			const custRes = await fetch('https://api.paystack.co/customer', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({email}),
			});
			const custData = await custRes.json();
			if (!custData.status) {
				throw new Error(custData.message || 'Customer creation failed');
			}
			const {customer_code} = custData.data;
			// await prisma.user.update({
			// 	where: {id: user.id},
			// 	data: {paystackCustomerId: customer_code},
			// });
			user = {...user, paystackCustomerId: customer_code};
			logger.info(`Created customer for ${email} (code: ${customer_code})`);
		}
		
		// Create subscription
		const subRes = await fetch('https://api.paystack.co/subscription', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				customer: user.paystackCustomerId,
				plan: plan.planCode,
			}),
		});
		const subData = await subRes.json();
		if (!subData.status) {
			throw new Error(subData.message || 'Subscription creation failed');
		}
		const {subscription_code, next_payment_date, status: subStatus} = subData.data;
		
		const subscription = await prisma.subscription.create({
			data: {
				userId: user.id,
				planId: plan.id,
				subscriptionCode: subscription_code,
				status: subStatus,
				nextPaymentDate: next_payment_date ? new Date(next_payment_date) : undefined,
			},
		});
		
		logger.info(`Created subscription ${subscription_code} for user ${user.id}`);
		return NextResponse.json({success: true, subscription});
	} catch (error: any) {
		logger.error(`Subscription Error: ${error.message}`);
		return NextResponse.json({error: error.message}, {status: 400});
	}
}
