import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/prisma/db';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define the Zod schema for user input validation
const userUpdateSchema = z.object({
  name: z.string().min(1).max(100),
  bio: z.string().max(500),
  phone: z.string().max(20)
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const userId = req.headers.get('x-user-id');
    console.log('Received X-User-ID:', userId);

    

    if (!userId) {
      console.log('User ID is null or undefined');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate user input
    const validatedData = userUpdateSchema.parse({
      name: formData.get('name'),
      bio: formData.get('bio'),
      phone: formData.get('phone'),
    });

    // Handle avatar upload
    let avatarUrl;
    const avatarFile = formData.get('avatar') as File | null;
    if (avatarFile && avatarFile instanceof File) {
      const arrayBuffer = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = buffer.toString('base64');
      const dataURI = `data:${avatarFile.type};base64,${base64Image}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'user_avatars',
      });
      avatarUrl = result.secure_url;
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        ...validatedData,
        ...(avatarUrl && { avatar: avatarUrl }),
      },
    });

    return NextResponse.json({ message: 'Profile updated successfully', status: 201});
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'An error occurred while updating the profile' }, { status: 500 });
  }
}
