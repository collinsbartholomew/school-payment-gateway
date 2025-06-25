import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';

export async function POST(req: NextRequest) {
	try {
		const { email } = await req.json();
		if (!email) {
			return NextResponse.json({ error: 'Email is required' }, { status: 400 });
		}
		
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
		}
		
		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_SECRET as string,
			{ expiresIn: '1h' }
		);
		
		const response = NextResponse.json({ message: 'Login successful' });
		response.cookies.set('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 3600, // 1 hour
			path: '/',
			sameSite: 'lax',
		});
		
		return response;
	} catch (err) {
		console.error('Login error:', err);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
