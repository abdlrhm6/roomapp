import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Create the response
    const response = NextResponse.json({ message: 'Logout successful' }, { status: 200 });

    // Clear the JWT token cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), // Set expiration to the past to delete the cookie
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
