import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";


export async function GET(req: NextRequest) {

    const userId = req.headers.get("x-user-id")

    if(!userId){
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    const notifications = await prisma.notification.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return NextResponse.json(notifications)

}
