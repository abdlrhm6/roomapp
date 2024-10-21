import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";

export async function POST(req: NextRequest) {
  const senderId = req.headers.get("x-user-id");

  if (!senderId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { roomId, text } = await req.json();

  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId ,
        members: {
          has: senderId
        }
      },
      include: { conversation: true }
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    let conversationId = room.conversation[0]?.id;

    if (!conversationId) {
      const newConversation = await prisma.conversation.create({
        data: {
          participants: [senderId],
          room: { connect: { id: roomId } }
        }
      });
      conversationId = newConversation.id;
    }

    const message = await prisma.message.create({
      data: {
        text,
        sender: { connect: { id: senderId } },
        receiver: { connect: { id: senderId } }, // Same as sender for room chat
        conversation: { connect: { id: conversationId } }
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        }
      }
    });

    const updatedConversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
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
    });

    return NextResponse.json({
      message,
      conversation: updatedConversation,
      status: 200
    });

  } catch (error) {
    console.error("Error sending room message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

