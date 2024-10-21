import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/prisma/db';
export async function GET(req: NextRequest) {
  try {
    
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, secret) as { userId: string };
    

    return NextResponse.json({user: decoded.userId ,status: 200});
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({error: 'Invalid token' }, { status: 401 });
    }
    console.error('Token verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
