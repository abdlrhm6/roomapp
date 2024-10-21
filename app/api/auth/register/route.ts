import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import prisma from "@/prisma/db"

// Define the registration schema using Zod
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  repeatPassword: z.string().min(8),
  name: z.string().optional(),
}).refine((data) => data.password === data.repeatPassword, {
  message: "Passwords don't match",
  path: ["repeatPassword"],
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' ,status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return NextResponse.json({ message: 'User registered successfully' ,status: 201 });
  } catch (error) {

    console.log(error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors ,status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' ,status: 500 });
  }
}
