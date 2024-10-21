import { NextResponse } from 'next/server';
import prisma from '@/prisma/db'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the input
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      const errorMessage = result.error.issues.map(issue => issue.message).join(', ');
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { email, password } = result.data;

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials',status: 401 });
    }

    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials',status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    // Create the response
    const response = NextResponse.json({ message: 'Login successful',status:200 });

    // Set the JWT token as an HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error',status: 500 });
  }
}
