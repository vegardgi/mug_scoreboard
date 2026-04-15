import { prisma } from "@/lib/db";
import ScoreboardClient from "@/components/scoreboard/ScoreboardClient";
import type { PublicPlayer } from "@/lib/types";

async function getTopPlayers(): Promise<PublicPlayer[]> {
  try {
    const players = await prisma.player.findMany({
      orderBy: { score: "desc" },
      take: 10,
      select: { id: true, name: true, score: true },
    });
    return players;
  } catch {
    return [];
  }
}

export default async function ScoreboardPage() {
  const players = await getTopPlayers();
  return <ScoreboardClient initial={players} />;
}
