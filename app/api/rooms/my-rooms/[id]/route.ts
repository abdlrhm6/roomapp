import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  

  try {
    const room = await prisma.room.findUnique({
      where: { 
        id ,
        members: {
          has: userId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        
      },
    });

    console.log(room);
    const members = await prisma.user.findMany({
      where: {
        id: {
          in: room?.members,
        },
      },
    });


    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({room,members});
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
