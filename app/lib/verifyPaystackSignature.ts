// import crypto from 'crypto'
// import {BinaryLike, HashOptions} from "node:crypto";

// export function verifyPaystackSignature(rawBody: String, signature: string): boolean {
// 	const secret = process.env.PAYSTACK_WEBHOOK_SECRET!
// 	const hash = crypto.createHash('sha512', secret as HashOptions).update(rawBody as BinaryLike).digest('hex')
	
// 	return hash === signature
// }
