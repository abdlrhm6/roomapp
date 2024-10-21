import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
    
    const { id } = params;

    const user = await prisma.user.findUnique({
        where: {
            id
        },
        include: {
            rooms: true
        }
    })

    return NextResponse.json({user})
} 




