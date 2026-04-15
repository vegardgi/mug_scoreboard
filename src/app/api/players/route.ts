import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const all = request.nextUrl.searchParams.get("all") === "true";

    if (all) {
      const players = await prisma.player.findMany({
        orderBy: { score: "desc" },
      });
      const result = players.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }));
      return NextResponse.json({ players: result });
    }

    const players = await prisma.player.findMany({
      orderBy: { score: "desc" },
      take: 10,
      select: { id: true, name: true, score: true },
    });
    return NextResponse.json({ players });
  } catch {
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, score, age, email, phone } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const player = await prisma.player.create({
      data: {
        name: name.trim(),
        score: typeof score === "number" ? score : 0,
        age: age ?? null,
        email: email?.trim() || null,
        phone: phone?.trim() || null,
      },
    });

    return NextResponse.json(
      {
        player: {
          ...player,
          createdAt: player.createdAt.toISOString(),
          updatedAt: player.updatedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to create player" }, { status: 500 });
  }
}
