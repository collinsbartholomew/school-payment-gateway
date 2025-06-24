// app/api/paystack/webhook/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import logger from '../../../lib/logger';
import { verifyPaystackSignature } from '../../../lib/verifyPaystackSignature';

export async function POST(request: Request) {
	try {
		const signature = request.headers.get('x-paystack-signature') || '';
		const rawBody = await request.text();
		
		// Verify signature
		if (!verifyPaystackSignature(rawBody, signature)) {
			logger.warn('Invalid Paystack webhook signature');
			return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
		}
		
		const event = JSON.parse(rawBody);
		const { event: eventType, data } = event;
		
		// Process known events
		if (eventType === 'charge.success') {
			const reference = data.reference;
			await prisma.payment.updateMany({
				where: { reference },
				data: { status: 'success', paidAt: new Date(data.paid_at) },
			});
			logger.info(`Webhook: charge.success for ${reference}`);
		} else if (eventType === 'subscription.create') {
			const code = data.subscription_code;
			await prisma.subscription.updateMany({
				where: { subscriptionCode: code },
				data: { status: 'active', nextPaymentDate: new Date(data.next_payment_date) },
			});
			logger.info(`Webhook: subscription.create for ${code}`);
		} else if (eventType === 'invoice.update') {
			// Update nextPaymentDate for the subscription invoice
			const code = data.subscription.subscription_code;
			await prisma.subscription.updateMany({
				where: { subscriptionCode: code },
				data: { nextPaymentDate: new Date(data.next_payment_date) },
			});
			logger.info(`Webhook: invoice.update for subscription ${code}`);
		}
		
		// Return 200 OK
		return NextResponse.json({ received: true });
	} catch (error: any) {
		logger.error(`Webhook Error: ${error.message}`);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
