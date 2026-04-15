"use client";

import { useState, useCallback, useEffect } from "react";
import { usePolling } from "@/hooks/usePolling";
import type { PublicPlayer } from "@/lib/types";

const RANK_COLORS: Record<number, string> = {
  1: "#FFD700",
  2: "#C0C0C0",
  3: "#CD7F32",
};

const RANK_LABELS: Record<number, string> = {
  1: "1ST",
  2: "2ND",
  3: "3RD",
};

function rankLabel(rank: number) {
  return RANK_LABELS[rank] ?? `${rank}TH`;
}

function rankColor(rank: number) {
  return RANK_COLORS[rank] ?? "#ffffff";
}

function PacManIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path
        d="M20 20 L38 8 A20 20 0 1 0 38 32 Z"
        fill="#FFD700"
      />
    </svg>
  );
}

export default function ScoreboardClient({
  initial,
}: {
  initial: PublicPlayer[];
}) {
  const [players, setPlayers] = useState<PublicPlayer[]>(initial);
  const [flashIds, setFlashIds] = useState<Set<number>>(new Set());

  const fetchPlayers = useCallback(async () => {
    try {
      const res = await fetch("/api/players", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      const incoming: PublicPlayer[] = data.players;

      setPlayers((prev) => {
        const prevMap = new Map(prev.map((p) => [p.id, p.score]));
        const changed = incoming
          .filter((p) => prevMap.has(p.id) && prevMap.get(p.id) !== p.score)
          .map((p) => p.id);
        if (changed.length > 0) {
          setFlashIds(new Set(changed));
          setTimeout(() => setFlashIds(new Set()), 700);
        }
        return incoming;
      });
    } catch {
      // silent
    }
  }, []);

  usePolling(fetchPlayers, 10_000);

  // Pad to always show 10 rows
  const rows = [...players];
  while (rows.length < 10) {
    rows.push({ id: -(rows.length + 1), name: "---", score: 0 });
  }

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Header */}
      <div
        className="flex items-center justify-between px-12 py-5"
        style={{ borderBottom: "2px solid #FFD700" }}
      >
        <div className="flex items-center gap-4">
          <PacManIcon />
          <span
            style={{
              fontFamily: "var(--font-press-start), monospace",
              color: "#FFD700",
              fontSize: "clamp(1rem, 2.5vw, 2rem)",
              letterSpacing: "0.08em",
            }}
          >
            HIGH SCORES
          </span>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <span
            className="animate-pulse inline-block w-3 h-3 rounded-full"
            style={{ background: "#00FF41" }}
          />
          <span
            style={{
              fontFamily: "var(--font-press-start), monospace",
              color: "#00FF41",
              fontSize: "clamp(0.5rem, 1vw, 0.75rem)",
            }}
          >
            LIVE
          </span>
        </div>
      </div>

      {/* Dot marquee divider */}
      <div
        className="overflow-hidden"
        style={{ height: "2em", display: "flex", alignItems: "center" }}
      >
        <span
          className="marquee-track"
          style={{
            fontFamily: "var(--font-press-start), monospace",
            color: "rgba(255,215,0,0.35)",
            fontSize: "clamp(0.5rem, 1vw, 0.85rem)",
          }}
        >
          {"· · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · "}
          {"· · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · "}
        </span>
      </div>

      {/* Column headers */}
      <div
        className="flex items-center px-12"
        style={{
          fontFamily: "var(--font-press-start), monospace",
          color: "rgba(255,215,0,0.5)",
          fontSize: "clamp(0.4rem, 0.8vw, 0.65rem)",
          letterSpacing: "0.12em",
          paddingBottom: "0.5rem",
        }}
      >
        <span style={{ width: "clamp(60px, 8vw, 120px)", textAlign: "right" }}>
          RANK
        </span>
        <span style={{ flex: 1, paddingLeft: "clamp(1rem, 3vw, 3rem)" }}>
          NAVN
        </span>
        <span style={{ width: "clamp(80px, 12vw, 160px)", textAlign: "right" }}>
          SCORE
        </span>
      </div>

      {/* Score rows — flex-1 so they fill remaining height evenly */}
      <div className="flex flex-col flex-1 px-12 pb-6" style={{ gap: "0.25rem" }}>
        {rows.map((player, index) => {
          const rank = index + 1;
          const color = rankColor(rank);
          const isPlaceholder = player.id < 0;
          const isFlashing = flashIds.has(player.id);

          return (
            <div
              key={player.id}
              className={`row-enter flex items-center flex-1 rounded ${isFlashing ? "row-flash" : ""}`}
              style={{
                animationDelay: `${index * 0.07}s`,
                borderBottom: "1px solid rgba(255,215,0,0.08)",
                opacity: isPlaceholder ? 0.25 : 1,
              }}
            >
              {/* Rank */}
              <span
                style={{
                  width: "clamp(60px, 8vw, 120px)",
                  textAlign: "right",
                  fontFamily: "var(--font-press-start), monospace",
                  color,
                  fontSize: "clamp(0.6rem, 1.2vw, 1.1rem)",
                  flexShrink: 0,
                }}
              >
                {rankLabel(rank)}
              </span>

              {/* Name */}
              <span
                style={{
                  flex: 1,
                  paddingLeft: "clamp(1rem, 3vw, 3rem)",
                  fontFamily: "var(--font-press-start), monospace",
                  color: isPlaceholder ? "#666" : color,
                  fontSize: "clamp(0.7rem, 1.6vw, 1.4rem)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {player.name}
              </span>

              {/* Score */}
              <span
                style={{
                  width: "clamp(80px, 12vw, 160px)",
                  textAlign: "right",
                  fontFamily: "var(--font-press-start), monospace",
                  color: isPlaceholder ? "#666" : color,
                  fontSize: "clamp(0.7rem, 1.6vw, 1.4rem)",
                  fontVariantNumeric: "tabular-nums",
                  flexShrink: 0,
                }}
              >
                {isPlaceholder ? "· · ·" : player.score.toLocaleString("no-NO")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
