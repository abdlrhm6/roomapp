import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const requests = await prisma.roomRequest.findMany({
      where: {
        room: {
          userId: userId
        }
      },
      include: {
        room: {
          select: {
            name: true,
            id: true
          }
        },
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      }
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
