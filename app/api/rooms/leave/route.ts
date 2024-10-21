import prisma from "@/prisma/db"
import { NextResponse } from "next/server"


export async function POST(req: Request) {
    const userId = req.headers.get("x-user-id")
    const { roomId } = await req.json()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    
    const userIsAmember = await prisma.room.findFirst({
        where: {
            id: roomId,
            members: {
                has: userId,
            },
        },
    })
    if (!userIsAmember) return NextResponse.json({ error: "You are not a member" }, { status: 400 })

    const roomMembers = await prisma.room.findUnique({
        where: {
            id: roomId,
        },
        select: {
            members: true
        }
    })
    const newRoomMembers = roomMembers?.members.filter((member) => member !== userId)
    try {
        await prisma.room.update({
            where: { id: roomId },
            data: { members: newRoomMembers , currentCapacity: {decrement: 1} }
        })

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}