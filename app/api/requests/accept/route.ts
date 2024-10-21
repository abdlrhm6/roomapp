import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db"


export async function POST(req: NextRequest) {

    const { requestId, room, sender } = await req.json()

    

    try {
       
        await prisma.roomRequest.delete({
            where: {
                id:requestId
                
            }
        })
        
        const roomToUpdate = await prisma.room.findUnique({
            where: {
                id: room.id
            }
        })



        if(roomToUpdate?.members.length === roomToUpdate?.fullCapacity){
            return NextResponse.json({ status: 400, message: "Room is full" })
        }
        
        const newRoom = await prisma.room.update({
            where: {
                id: room.id
            },
            data: {
                members: {
                    push: sender.id
                },
                currentCapacity: {
                    increment: 1
                }
            }
        })
        
        

        await prisma.notification.create({
            data: {
                userId: sender.id,
                text: `Your request to join ${newRoom.name} has been accepted`,
                type: "accept"
            }
        })

        //send notif to all this room requests and delete them 
        if(newRoom.currentCapacity === newRoom.fullCapacity){
            const usersRequests = await prisma.roomRequest.findMany({
                where: {
                    roomId: room.id
                }
            })

            // Use for...of to handle async operations correctly
            for (const userRequest of usersRequests) {
                await prisma.notification.create({
                    data: {
                        userId: userRequest.senderId,
                        text: `${newRoom.name} is now full, your request has been removed`,
                        type: "full"
                    }
                });
            }


            
        }

        return NextResponse.json({ status: 200 })
    } catch (error) {
        console.error("Error accepting request:", error.message); // Log the error message
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
    }
}
