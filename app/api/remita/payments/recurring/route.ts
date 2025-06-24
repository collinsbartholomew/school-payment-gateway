// pages/api/payments/recurring.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { sha512, callRemita } from '../../../lib/remita';
import { z } from 'zod';

// Schema for mandate setup
const mandateSchema = z.object({
	serviceTypeId: z.string().nonempty(),
	orderId: z.string().nonempty(),
	amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
	payerName: z.string().min(2),
	payerEmail: z.string().email(),
	payerPhone: z.string().min(7).max(15),
	payerBankCode: z.string().min(3).max(3),  // e.g., "057"
	payerAccount: z.string().nonempty(),
	startDate: z.string().nonempty(), // Format YYYY-MM-DD
	endDate: z.string().nonempty(),   // Format YYYY-MM-DD
	maxDebits: z.string().optional(), // optional limit
	frequency: z.string().optional(), // e.g., "1" (months between debits)
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
	const result = mandateSchema.safeParse(req.body);
	if (!result.success) return res.status(400).json({ error: 'Invalid input', details: result.error.issues });
	
	const {
		serviceTypeId, orderId, amount, payerName, payerEmail,
		payerPhone, payerBankCode, payerAccount, startDate, endDate, maxDebits = '1', frequency = '1'
	} = result.data;
	
	try {
		// Compose payload as per Remita's mandate API
		const payload = {
			serviceTypeId,
			orderId,
			amount,
			payerName,
			payerEmail,
			payerPhone,
			payerBankCode,
			payerAccount,
			startDate,
			endDate,
			frequency,
			maxDebits,
		};
		
		// Authorization: similar pattern, but endpoint may differ for mandate
		// (Adjust the path and token formula per Remita docs.)
		const token = sha512(`${process.env.REMITA_MERCHANT_ID}${serviceTypeId}${orderId}${process.env.REMITA_API_KEY}`);
		const authHeader = `remitaConsumerKey=${process.env.REMITA_MERCHANT_ID},remitaConsumerToken=${token}`;
		
		// Call Remita mandate setup API (example path; use actual as per docs)
		const data = await callRemita('/echannelsvc/merchant/api/mandateserv/mandate/initialize', payload, authHeader);
		
		// Expect data to contain a mandate reference or instructions
		return res.status(200).json(data);
	} catch (err: any) {
		console.error('Mandate setup failed:', err);
		res.status(500).json({ error: 'Failed to create mandate' });
	}
}
