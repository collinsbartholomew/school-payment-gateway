// // app/api/paystack/split/route.ts
// import { NextResponse } from 'next/server';
// import { z } from 'zod';
// import logger from '../../../lib/logger';

// const SubaccountSchema = z.object({
// 	type: z.literal('subaccount'),
// 	business_name: z.string(),
// 	bank_code: z.string(),
// 	account_number: z.string(),
// 	percentage_charge: z.number(),
// });

// const SplitSchema = z.object({
// 	type: z.literal('split'),
// 	name: z.string(),
// 	split_type: z.enum(['percentage', 'flat']),
// 	currency: z.string().default('NGN'),
// 	subaccounts: z.array(
// 		z.object({
// 			subaccount: z.string(),
// 			share: z.number().positive(),
// 		})
// 	),
// });

// export async function POST(request: Request) {
// 	try {
// 		const body = await request.json();
// 		if (body.type === 'subaccount') {
// 			const data = SubaccountSchema.parse(body);
// 			// Create subaccount
// 			const res = await fetch('https://api.paystack.co/subaccount', {
// 				method: 'POST',
// 				headers: {
// 					Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
// 					'Content-Type': 'application/json',
// 				},
// 				body: JSON.stringify({
// 					business_name: data.business_name,
// 					bank_code: data.bank_code,
// 					account_number: data.account_number,
// 					percentage_charge: data.percentage_charge,
// 				}),
// 			});
// 			const result = await res.json();
// 			if (!result.status) throw new Error(result.message);
// 			logger.info(`Created subaccount ${data.business_name}`);
// 			return NextResponse.json({ success: true, subaccount: result.data });
// 		} else if (body.type === 'split') {
// 			const data = SplitSchema.parse(body);
// 			// Create multi-split
// 			const res = await fetch('https://api.paystack.co/split', {
// 				method: 'POST',
// 				headers: {
// 					Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
// 					'Content-Type': 'application/json',
// 				},
// 				body: JSON.stringify({
// 					name: data.name,
// 					type: data.split_type,
// 					currency: data.currency,
// 					subaccounts: data.subaccounts,
// 				}),
// 			});
// 			const result = await res.json();
// 			if (!result.status) throw new Error(result.message);
// 			logger.info(`Created transaction split ${data.name}`);
// 			return NextResponse.json({ success: true, split: result.data });
// 		} else {
// 			return NextResponse.json({ error: 'Invalid split type' }, { status: 400 });
// 		}
// 	} catch (error: any) {
// 		logger.error(`Split Error: ${error.message}`);
// 		return NextResponse.json({ error: error.message }, { status: 400 });
// 	}
// }
