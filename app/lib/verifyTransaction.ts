import logger from './logger'

export async function verifyTransaction(reference: string){
	
	const res = await fetch(
		`https://api.paystack.co/transactions/verify/${reference}`, {
			method: 'GET',
			headers: {
				Authorisation: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
				'Content-Type': 'application/json',
			}
		}
	)
	
	const data = await res.json()
	if (!data.status) {
		logger.error(`Error verify transaction status: ${data.message}`)
		throw new Error(data.message || 'Error verify transaction status')
	}
	
	return data.data
	
}