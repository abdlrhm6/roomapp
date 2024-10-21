import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db"

export async function POST(req: NextRequest){

    const userId = req.headers.get("x-user-id")

    if(!userId) return NextResponse.json({message:"Unauthorized",status:401})

    const {message,roomId} = await req.json()

    const roomRequest = await prisma.roomRequest.findFirst({
        where: {
            senderId: userId
        }
    })

    const roomToJoin = await prisma.room.findUnique({
        where: {
            id: roomId
        }
    })

    

    if(roomRequest?.roomId || roomToJoin?.members.includes(userId)) return NextResponse.json({message: "Request already sent Or You are already a member",status: 400})

    

    try{

        await prisma.roomRequest.create({
        
            data: {
                sender: {
                    connect : {
                        id: userId
                    }
                },
                room: {
                    connect: {
                        id: roomId
                    }
                } ,
                message
            }
        })
        return NextResponse.json({message: "Request Sent",status: 201})
    } catch (error) {
        console.error("Error sending request:", error);
        return NextResponse.json({ status: 500 });
    }   
}