// // pages/api/payments/one-time.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
// import { buildAuthHeader, callRemita } from '../../../lib/remita';
// import { z } from 'zod';
//
// // Schema validation (allowlist approach):contentReference[oaicite:7]{index=7}
// const paymentSchema = z.object({
// 	serviceTypeId: z.string().nonempty(),
// 	orderId: z.string().nonempty(),
// 	amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Amount must be a number"),
// 	payerName: z.string().min(2),
// 	payerEmail: z.string().email(),
// 	payerPhone: z.string().min(7).max(15),
// 	description: z.string().optional(),
// });
//
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
// 	if (req.method !== 'POST') {
// 		return res.status(405).json({ error: 'Method not allowed' });
// 	}
// 	// Validate input
// 	const result = paymentSchema.safeParse(req.body);
// 	if (!result.success) {
// 		return res.status(400).json({ error: 'Invalid input', details: result.error.issues });
// 	}
// 	const { serviceTypeId, orderId, amount, payerName, payerEmail, payerPhone, description } = result.data;
//	
// 	try {
// 		// Build authorization header (see Remita docs):contentReference[oaicite:8]{index=8}
// 		const authHeader = buildAuthHeader(serviceTypeId, orderId, amount);
//		
// 		// Prepare payload for Remita
// 		const payload = {
// 			serviceTypeId,
// 			orderId,
// 			amount,
// 			payerName,
// 			payerEmail,
// 			payerPhone,
// 			description: description || 'Payment',
// 		};
//		
// 		// Call Remita's payment initialization API
// 		const data = await callRemita('/echannelsvc/merchant/api/paymentinit', payload, authHeader);
//		
// 		// On success, Remita returns { statuscode: "025", RRR: "12345...", status: "Payment Reference generated" }
// 		if (data.RRR) {
// 			// Return RRR to frontend to finalize payment
// 			return res.status(200).json({ rrr: data.RRR });
// 		} else {
// 			// Unexpected response
// 			throw new Error(`Remita did not return RRR: ${JSON.stringify(data)}`);
// 		}
// 	} catch (error: any) {
// 		console.error('RRR generation failed:', error);
// 		return res.status(500).json({ error: 'Failed to create payment' });
// 	}
// }
