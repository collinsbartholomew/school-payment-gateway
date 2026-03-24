import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '../../../lib/prisma';
import logger from '../../../lib/logger';

const VerifySchema = z.object({
	reference: z.string().min(1),
});

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { reference } = VerifySchema.parse(body);

		// Verify transaction with Paystack
		const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
			},
		});

		const paystackData = await paystackRes.json();

		if (!paystackData.status || !paystackData.data) {
			logger.error(`Paystack verification failed for reference: ${reference}`);
			return NextResponse.json(
				{ status: 'error', message: 'Verification failed' },
				{ status: 400 }
			);
		}

		const transaction = paystackData.data;
		const { customer, amount, status } = transaction;

		if (status !== 'success') {
			logger.warn(`Transaction failed for reference: ${reference}, status: ${status}`);
			return NextResponse.json(
				{ status: 'error', message: 'Transaction was not successful' },
				{ status: 400 }
			);
		}

		// Update payment in database
		try {
			const payment = await prisma.payment.findUnique({
				where: { reference },
			});

			if (!payment) {
				logger.warn(`Payment record not found for reference: ${reference}`);
				return NextResponse.json(
					{ status: 'error', message: 'Payment record not found' },
					{ status: 404 }
				);
			}

			// Update payment status
			await prisma.payment.update({
				where: { reference },
				data: {
					status: 'success',
					paidAt: new Date(),
					channel: transaction.channel || 'paystack',
				},
			});

			logger.info(`Payment verified successfully: ${reference}`);
			return NextResponse.json({
				status: 'success',
				message: 'Payment verified',
				reference,
				amount,
			});
		} catch (dbError: any) {
			logger.error(`Database error during payment verification: ${dbError.message}`);
			return NextResponse.json(
				{ status: 'error', message: 'Database error' },
				{ status: 500 }
			);
		}
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			logger.error(`Validation error: ${JSON.stringify(error.errors)}`);
			return NextResponse.json(
				{ error: 'Invalid request data' },
				{ status: 400 }
			);
		}
		logger.error(`Verify Transaction Error: ${error.message}`);
		return NextResponse.json(
			{ error: error.message || 'Verification failed' },
			{ status: 500 }
		);
	}
}

