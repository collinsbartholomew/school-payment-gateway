// // app/api/paystack/verify/route.ts
// import { NextResponse } from 'next/server';
// import { z } from 'zod';
// import prisma from '../../../lib/prisma';
// import { verifyTransaction } from '../../../lib/verifyTransaction';
// import logger from '../../../lib/logger';

// const VerifySchema = z.object({ reference: z.string() });

// export async function POST(request: Request) {
// 	try {
// 		const body = await request.json();
// 		const { reference } = VerifySchema.parse(body);
		
// 		const transaction = await verifyTransaction(reference);
// 		// Update Payment record
// 		await prisma.payment.update({
// 			where: { reference },
// 			data: {
// 				status: transaction.status,
// 				channel: transaction.channel,
// 				paidAt: transaction.paid_at ? new Date(transaction.paid_at) : undefined,
// 			},
// 		});
		
// 		logger.info(`Verified transaction ${reference}: ${transaction.status}`);
// 		return NextResponse.json({ success: true, transaction });
// 	} catch (error: any) {
// 		logger.error(`Verify Transaction Error: ${error.message}`);
// 		return NextResponse.json({ error: error.message }, { status: 400 });
// 	}
// }
