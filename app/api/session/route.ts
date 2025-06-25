// import { cookies } from 'next/headers';
// import jwt from 'jsonwebtoken';
// import prisma from '../../lib/prisma';
// import { NextResponse } from 'next/server';
//
// export async function GET() {
// 	const cookieStore = await cookies();
// 	const token = cookieStore.get('token')?.value;
//
// 	if (!token) {
// 		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// 	}
//
// 	try {
// 		const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { regNumber: string };
//
// 		const user = await prisma.user.findUnique({
// 			where: { regNumber: payload.regNumber },
// 			include: {
// 				payments: true,
// 				subscriptions: true,
// 				// include other relations if needed
// 			},
// 		});
//
// 		if (!user) {
// 			return NextResponse.json({ error: 'User not found' }, { status: 404 });
// 		}
//
// 		return NextResponse.json({ user }, { status: 200 });
// 	} catch (err) {
// 		return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
// 	}
// }
