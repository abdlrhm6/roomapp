import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest){

    const userId = req.headers.get("x-user-id");

    if(!userId){
        return NextResponse.json({error: "User id is required"}, {status: 400});
    }
    
   const conversations = await prisma.conversation.findMany({
       where: {
           messages: {
               some: {
                   receiverId: userId
               }
           },
           room: {
               is: null
           }
       },
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

    return NextResponse.json({conversations,status: 200});
}
