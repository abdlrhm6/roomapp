import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const userId = req.headers.get("x-user-id");
    
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
        await prisma.room.delete({
            where: {
                id,
                userId,
            },
        });
        return NextResponse.json({success: true}, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
