// // app/api/paystack/customer/route.ts
// import {NextResponse} from 'next/server';
// import {z} from 'zod';
// import prisma from '../../../lib/prisma';
// import logger from '../../../lib/logger';

// const CreateCustomerSchema = z.object({
// 	email: z.string().email(),
// 	first_name: z.string().optional(),
// 	last_name: z.string().optional(),
// 	phone: z.string().optional(),
// });

// export async function POST(request: Request) {
// 	try {
// 		const body = await request.json();
// 		const {email, first_name, last_name, phone} = CreateCustomerSchema.parse(body);
		
// 		// Find or create user
// 		let user = await prisma.user.findUnique({where: {email}});
// 		if (!user) {
// 			user = await prisma.user.create({data: {email, firstName: first_name, lastName: last_name, phone}});
// 		} else {
// 			user = await prisma.user.update({
// 				where: {id: user.id},
// 				data: {firstName: first_name, lastName: last_name, phone},
// 			});
// 		}
		
// 		// Create Paystack customer
// 		const res = await fetch('https://api.paystack.co/customer', {
// 			method: 'POST',
// 			headers: {
// 				Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
// 				'Content-Type': 'application/json',
// 			},
// 			body: JSON.stringify({email, first_name, last_name, phone}),
// 		});
// 		const resData = await res.json();
// 		if (!resData.status) {
// 			throw new Error(resData.message || 'Customer creation failed');
// 		}
// 		const {customer_code} = resData.data;
		
// 		await prisma.user.update({
// 			where: {id: user.id},
// 			data: {paystackCustomerId: customer_code},
// 		});
		
// 		logger.info(`Created customer ${customer_code} for ${email}`);
// 		return NextResponse.json({success: true, customer_code});
// 	} catch (error: any) {
// 		logger.error(`Customer POST Error: ${error.message}`);
// 		return NextResponse.json({error: error.message}, {status: 400});
// 	}
// }

// export async function GET(request: Request) {
// 	try {
// 		const url = new URL(request.url);
// 		const identifier = url.searchParams.get('identifier');
// 		if (!identifier) {
// 			return NextResponse.json({error: 'Missing customer identifier'}, {status: 400});
// 		}
		
// 		// Fetch customer from Paystack (identifier can be email or Paystack customer code)
// 		const res = await fetch(`https://api.paystack.co/customer/${identifier}`, {
// 			headers: {Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`},
// 		});
// 		const resData = await res.json();
// 		if (!resData.status) {
// 			throw new Error(resData.message || 'Customer not found');
// 		}
// 		const customer = resData.data;
// 		return NextResponse.json({customer});
// 	} catch (error: any) {
// 		logger.error(`Customer GET Error: ${error.message}`);
// 		return NextResponse.json({error: error.message}, {status: 400});
// 	}
// }
