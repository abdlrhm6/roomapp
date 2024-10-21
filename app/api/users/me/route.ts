import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db"

export  async function GET(req: NextRequest){
    const userId = req.headers.get("x-user-id")
    if(!userId){
        return NextResponse.json({message: "UserNot Found", status: 404})
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },include: {
            rooms: true
        }
    })

    

    return NextResponse.json({user,status: 200})
}