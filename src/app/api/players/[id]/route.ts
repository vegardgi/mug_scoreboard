import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const playerId = parseInt(id, 10);
    if (isNaN(playerId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();
    const { name, score, age, email, phone } = body;

    const player = await prisma.player.update({
      where: { id: playerId },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(score !== undefined && { score }),
        ...(age !== undefined && { age }),
        ...(email !== undefined && { email: email?.trim() || null }),
        ...(phone !== undefined && { phone: phone?.trim() || null }),
      },
    });

    return NextResponse.json({
      player: {
        ...player,
        createdAt: player.createdAt.toISOString(),
        updatedAt: player.updatedAt.toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to update player" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const playerId = parseInt(id, 10);
    if (isNaN(playerId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await prisma.player.delete({ where: { id: playerId } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Failed to delete player" }, { status: 500 });
  }
}
