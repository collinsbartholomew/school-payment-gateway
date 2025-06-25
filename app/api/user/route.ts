import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';

export async function GET() {
	
	const token = (await cookies()).get('token')?.value;
	if (!token) {
		return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
	}
	
	try {
		const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
		
		const user = await prisma.user.findUnique({
			where: { id },
			include: { payments: true, subscriptions: true },
		});
		
		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}
		
		return NextResponse.json(user);
	} catch (err: any) {
		if (err.name === 'TokenExpiredError') {
			return NextResponse.json({ error: 'Session expired' }, { status: 401 });
		}
		return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
	}
}
