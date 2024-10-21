import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "User id is required" }, { status: 400 });
  }

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: params.id,
      participants: {
        has: userId,
      },
    },
    include: {
     
      messages: {
        
        include: {
          
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
         
        },

      },
    },
  });

  const receiverId = conversation?.participants.find(
    (participant) => participant !== userId
  );

  return NextResponse.json({
    receiverId,
    messages: conversation?.messages,
    status: 200,
  });
}
