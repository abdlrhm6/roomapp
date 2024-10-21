
import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export  async function POST(req: NextRequest) {

  const { id, room, sender } = await req.json();

  try {
    const roomRequest = await prisma.roomRequest.delete({
      where: {
        id
      }
    });

    const notification = await prisma.notification.create({
      data: {
          type: "reject",
          text: `${sender.name} rejected your request to join ${room}`,
          userId: sender.id
      }
    })
    return NextResponse.json({ message: "Request rejected" ,status:200});
    
  } catch (error) {
    console.error("Error rejecting request:", error);
    return NextResponse.json({ message: "Internal Server Error" ,status:500});
  }
}

