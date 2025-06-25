// // pages/api/webhooks/remita.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
// import crypto from 'crypto';
//
// export const config = {
// 	api: {
// 		bodyParser: false, // We need raw body for signature verification
// 	},
// };
//
// async function getRawBody(req: NextApiRequest): Promise<Buffer> {
// 	return new Promise((resolve, reject) => {
// 		const chunks: Buffer[] = [];
// 		req.on('data', chunk => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
// 		req.on('end', () => resolve(Buffer.concat(chunks)));
// 		req.on('error', reject);
// 	});
// }
//
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
// 	if (req.method !== 'POST') return res.status(405).end();
//
// 	try {
// 		// Read raw request body
// 		const raw = await getRawBody(req);
//
// 		// Retrieve Remita signature header (example: X-Remita-Signature)
// 		const signatureHeader = req.headers['x-remita-signature'] as string;
// 		if (!signatureHeader) {
// 			console.warn('No signature header');
// 			return res.status(400).end();
// 		}
//
// 		// Compute our own HMAC-SHA512 of the payload using the API key (shared secret)
// 		const expectedSig = crypto.createHmac('sha512', process.env.REMITA_API_KEY!)
// 			.update(raw)
// 			.digest('hex');
//
// 		// Compare signatures (constant-time compare recommended)
// 		if (!crypto.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(signatureHeader))) {
// 			console.warn('Invalid webhook signature');
// 			return res.status(401).end();
// 		}
//
// 		// Parse JSON payload after verification
// 		const payload = JSON.parse(raw.toString());
// 		console.log('Received Remita webhook:', payload);
//
// 		// TODO: Update your database or trigger actions based on payload
// 		// e.g., mark order as paid if payload.status = "success"
//
// 		// Respond with 200 to acknowledge receipt
// 		res.status(200).json({ received: true });
// 	} catch (err: any) {
// 		console.error('Webhook handler error:', err);
// 		res.status(500).end();
// 	}
// }
