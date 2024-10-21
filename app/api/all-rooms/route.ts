import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";

export async function GET(request: NextRequest) {

  const { searchParams } = new URL(request.url);
  
  const country = searchParams.get('country');
  const city = searchParams.get('city');
  const minPrice = searchParams.get('price');
  const type = searchParams.get('type');


  let whereClause: { [key: string]: any } = {};

  if (country) {
    whereClause.country = { contains: country, mode: 'insensitive' };
  }

  if(type){
    whereClause.type = { contains: type, mode: 'insensitive' };
  }

  if (city) {
    whereClause.city = { contains: city, mode: 'insensitive' }; 
  }

  if (minPrice) {
    whereClause.price = {};
    if (minPrice) whereClause.price.lte = parseInt(minPrice);
  }

    console.log(whereClause);
  try {
    const rooms = await prisma.room.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        fullCapacity: true,
        currentCapacity: true,
        price: true,
        images: true,
        country: true,
        city: true,
        type: true
      },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
