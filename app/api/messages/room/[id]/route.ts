import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/prisma/db";

export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
  
    const userId = req.headers.get("x-user-id");
  
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const { id } = params;
  
    try {
      const room = await prisma.room.findUnique({
        where: { id },
        include: {
          conversation: {
            include: {
              messages: {
                include: {
                  sender: {
                    select: {
                      id: true,
                      name: true,
                      avatar: true,
                    }
                  }
                },
                orderBy: { createdAt: 'asc' }
              }
            }
          }
        }
      });
  
      if (!room) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
      }
  
      return NextResponse.json({
        conversation: room.conversation[0],
        status: 200
      });
  
    } catch (error) {

      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
  
  