import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary"; 
import { z } from "zod"; 
import prisma from "@/prisma/db";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const roomSchema = z.object({
  name: z.string().min(1),
  capacity: z.number().min(1),
  price: z.number().min(0),
  description: z.string().min(1),
  country: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(1),
  type: z.string().min(1),
  amenities: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {

  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ status: 404, message: 'User Not Found' });
  }

  // Parse the form data
  const fields = await req.formData();

  const images = fields.getAll("images"); // Access uploaded images

  const imageUrls: string[] = []; // Array to store image URLs

// Upload images to Cloudinary
for (const image of images) {
  if (image instanceof File) {
    const buffer = await image.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    const dataURI = `data:${image.type};base64,${base64Image}`;
    
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(dataURI, {
          folder: 'rooms', // Specify the folder in Cloudinary
        }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
      });
      
      if (typeof result === 'object' && 'secure_url' in result!) {
        imageUrls.push(result.secure_url as string);
      }
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
    }
  }
}
  try {
    const validatedData = roomSchema.parse({
      name: fields.get('name'),
      capacity: Number(fields.get('capacity')),
      price: Number(fields.get('price')),
      description: fields.get('description'),
      country: fields.get('country'),
      city: fields.get('city'),
      address: fields.get('address'),
      type: fields.get('type'),
      amenities: fields.getAll('amenities'),
    });
    
    const room = await prisma.room.create({
        data: {
            name: validatedData.name,
            description: validatedData.description,
            price: validatedData.price,
            address: validatedData.address,
            amenities: validatedData.amenities![0].split(","),
            city: validatedData.city,
            country: validatedData.country,
            type: validatedData.type,
            images: imageUrls,
            fullCapacity: validatedData.capacity,
            currentCapacity: 1,
            user: {
              connect: {
                id: userId
              }
            },
            members: [userId]
        }
    })

    return NextResponse.json({ status: 200, message: 'Room created successfully'});

  } catch (e: any) {

    console.log(e)
    return NextResponse.json({ status: 400, message: e.errors });
  }
  

}




