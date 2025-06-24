// pages/api/payments/biller.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { callRemita } from '../../../lib/remita';
import { z } from 'zod';

// Schema for biller payment
const billerSchema = z.object({
	serviceTypeId: z.string().nonempty(),  // Service code for biller payment
	orderId: z.string().nonempty(),
	amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
	billerName: z.string().min(2),
	billerAccount: z.string().nonempty(),
	payerName: z.string().min(2),
	payerEmail: z.string().email(),
	payerPhone: z.string().min(7).max(15),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
	const result = billerSchema.safeParse(req.body);
	if (!result.success) return res.status(400).json({ error: 'Invalid input', details: result.error.issues });
	
	const { serviceTypeId, orderId, amount, billerName, billerAccount, payerName, payerEmail, payerPhone } = result.data;
	
	try {
		// Construct payload as required by Remita Billing API
		const payload = {
			serviceTypeId,
			billerName,
			billerAccount,
			orderId,
			amount,
			payerName,
			payerEmail,
			payerPhone,
		};
		
		// Authorization token as per Remita spec
		const authHeader = buildAuthHeader(serviceTypeId, orderId, amount);
		
		// Call Remita biller payment API (example endpoint)
		const data = await callRemita('/echannelsvc/merchant/api/billpay', payload, authHeader);
		
		return res.status(200).json(data);
	} catch (err: any) {
		console.error('Biller payment failed:', err);
		res.status(500).json({ error: 'Failed to pay biller' });
	}
}
