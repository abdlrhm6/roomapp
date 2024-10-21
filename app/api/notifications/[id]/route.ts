import prisma from "@/prisma/db"
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        await prisma.notification.delete({
            where: {
                id
            }
        });

        return NextResponse.json({ status: 200 });

    } catch (error) {
        console.error("Error deleting notification:", error);
        return NextResponse.json({ status: 500 });
    }
}

