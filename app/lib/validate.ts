// middleware/validate.ts
import { NextApiRequest } from 'next';

/** Validate required fields, else throw an error */
export function requireFields(req: NextApiRequest, fields: string[]) {
	for (const field of fields) {
		if (!req.body?.[field]) {
			throw new Error(`Missing required field: ${field}`);
		}
	}
}
