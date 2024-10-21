import { NextResponse } from "next/server";
import prisma from "@/prisma/db";

export async function POST(req: Request) {
  const senderId = req.headers.get("x-user-id");

  if (!senderId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { receiverId, text, conversationId } = await req.json();

  try {
    let conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { has: senderId } },
          { participants: { has: receiverId } },
          { room: { is: null } }
        ]
      },
      include: {
        messages: true
      }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participants: [senderId, receiverId],
         },
        include: {
          messages: true
        }
      });
      return NextResponse.json({
        conversationId: conversation?.id,
        status: 200
      });
    } else if(conversation && conversationId && text) {
      await prisma.message.create({
        data: {
          text,
          sender: {
            connect: { id: senderId }
          },
          receiver: {
            connect: { id: receiverId }
          },
          conversation: {
            connect: { id:  conversationId }
          }

        }
      });

      conversation = await prisma.conversation.findUnique({
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
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    }
                }
            }
           },
       }     
    });
      return NextResponse.json({
        messages: conversation?.messages,
        status: 200
      });
    }else if(conversation && !text && !conversationId) {
      return NextResponse.json({
        messages: conversation?.messages,
        status: 200,
        conversationId: conversation?.id
      });

    }

    

  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

