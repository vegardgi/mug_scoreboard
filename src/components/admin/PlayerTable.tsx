"use client";

import type { AdminPlayer } from "@/lib/types";

export default function PlayerTable({
  players,
  onEdit,
  onDelete,
  deletingId,
  onConfirmDelete,
  onCancelDelete,
}: {
  players: AdminPlayer[];
  onEdit: (p: AdminPlayer) => void;
  onDelete: (id: number) => void;
  deletingId: number | null;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) {
  if (players.length === 0) {
    return (
      <p className="text-center py-16" style={{ color: "#555", fontFamily: "monospace" }}>
        Ingen spillere ennå. Legg til den første!
      </p>
    );
  }

  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid #222" }}>
      <table className="w-full text-sm" style={{ fontFamily: "monospace", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#111", borderBottom: "1px solid #333" }}>
            {["#", "Navn", "Score", "Alder", "E-post", "Telefon", "Handlinger"].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left"
                style={{ color: "#FFD700", fontWeight: "bold", fontSize: "0.75rem" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((player, index) => (
            <tr
              key={player.id}
              style={{
                borderBottom: "1px solid #1a1a1a",
                background: index % 2 === 0 ? "#0d0d0d" : "#111",
              }}
            >
              <td className="px-4 py-3" style={{ color: "#555" }}>
                {index + 1}
              </td>
              <td className="px-4 py-3" style={{ color: "#fff", fontWeight: "bold" }}>
                {player.name}
              </td>
              <td className="px-4 py-3" style={{ color: "#FFD700" }}>
                {player.score.toLocaleString("no-NO")}
              </td>
              <td className="px-4 py-3" style={{ color: "#aaa" }}>
                {player.age ?? <span style={{ color: "#444" }}>–</span>}
              </td>
              <td className="px-4 py-3" style={{ color: "#aaa" }}>
                {player.email ?? <span style={{ color: "#444" }}>–</span>}
              </td>
              <td className="px-4 py-3" style={{ color: "#aaa" }}>
                {player.phone ?? <span style={{ color: "#444" }}>–</span>}
              </td>
              <td className="px-4 py-3">
                {deletingId === player.id ? (
                  <span className="flex items-center gap-2 flex-wrap">
                    <span style={{ color: "#ff4444", fontSize: "0.75rem" }}>Sikker?</span>
                    <button
                      onClick={onConfirmDelete}
                      className="px-2 py-1 rounded text-xs"
                      style={{ background: "#ff4444", color: "#fff", cursor: "pointer" }}
                    >
                      Slett
                    </button>
                    <button
                      onClick={onCancelDelete}
                      className="px-2 py-1 rounded text-xs"
                      style={{ background: "#333", color: "#aaa", cursor: "pointer" }}
                    >
                      Nei
                    </button>
                  </span>
                ) : (
                  <span className="flex gap-2">
                    <button
                      onClick={() => onEdit(player)}
                      className="px-3 py-1 rounded text-xs transition-opacity hover:opacity-80"
                      style={{ background: "#1a3a1a", color: "#4caf50", border: "1px solid #2d5a2d", cursor: "pointer" }}
                    >
                      Rediger
                    </button>
                    <button
                      onClick={() => onDelete(player.id)}
                      className="px-3 py-1 rounded text-xs transition-opacity hover:opacity-80"
                      style={{ background: "#3a1a1a", color: "#f44336", border: "1px solid #5a2d2d", cursor: "pointer" }}
                    >
                      Slett
                    </button>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
