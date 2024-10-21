import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";

export async function GET(req: NextRequest) {

  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rooms = await prisma.room.findMany({
      where: { 
        OR: [
          {
            members: {
              hasSome: [userId]
            }
          },
          {
            userId: userId
          }
        ]
      },
      select: {
        id: true,
        name: true,
        fullCapacity: true,
        currentCapacity: true,
        price: true,
        images: true,
        userId: true
      },
    });

    console.log(rooms)

    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
