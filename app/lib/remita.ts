// // lib/remita.ts
// import crypto from 'crypto';
// import fetch from 'node-fetch';  // or native fetch in Node 18+

// const BASE_URL = process.env.REMITA_BASE_URL;
// const MERCHANT_ID = process.env.REMITA_MERCHANT_ID;
// const API_KEY = process.env.REMITA_API_KEY;

// // Compute SHA-512 hash as hex string
// export function sha512(data: string): string {
// 	return crypto.createHash('sha512').update(data, 'utf8').digest('hex');
// }

// /**
//  * Builds the Remita Authorization header for payment initialization.
//  * According to Remita docs, the header is:
//  *   Authorization: remitaConsumerKey={merchantID},remitaConsumerToken={sha512(merchantID+serviceTypeId+orderId+totalAmount+apiKey)}
//  */
// export function buildAuthHeader(serviceTypeId: string, orderId: string, amount: string): string {
// 	const token = sha512(`${MERCHANT_ID}${serviceTypeId}${orderId}${amount}${API_KEY}`);
// 	return `remitaConsumerKey=${MERCHANT_ID},remitaConsumerToken=${token}`;
// }

// /**
//  * Generic function to call Remita API endpoints.
//  * Ensures JSON headers and error handling.
//  */
// export async function callRemita(path: string, body: any, authHeader: string) {
// 	const res = await fetch(`${BASE_URL}${path}`, {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json',
// 			'Authorization': authHeader
// 		},
// 		body: JSON.stringify(body),
// 	});
// 	if (!res.ok) {
// 		const text = await res.text();
// 		throw new Error(`Remita API error: ${res.status} ${text}`);
// 	}
// 	return res.json();
// }
