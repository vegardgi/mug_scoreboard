"use client";

import { useState, useEffect, useCallback } from "react";
import PlayerTable from "@/components/admin/PlayerTable";
import PlayerForm from "@/components/admin/PlayerForm";
import type { AdminPlayer } from "@/lib/types";

export default function AdminPage() {
  const [players, setPlayers] = useState<AdminPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlayer, setEditingPlayer] = useState<AdminPlayer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchPlayers = useCallback(async () => {
    try {
      const res = await fetch("/api/players?all=true", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setPlayers(data.players ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  function handleAdd() {
    setEditingPlayer(null);
    setShowForm(true);
  }

  function handleEdit(player: AdminPlayer) {
    setEditingPlayer(player);
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingPlayer(null);
  }

  async function handleConfirmDelete() {
    if (deletingId == null) return;
    try {
      await fetch(`/api/players/${deletingId}`, { method: "DELETE" });
      setDeletingId(null);
      fetchPlayers();
    } catch {
      // silent
    }
  }

  return (
    <div
      className="min-h-screen p-8"
      style={{ background: "#0a0a0a", fontFamily: "monospace" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between mb-8 pb-4"
        style={{ borderBottom: "2px solid #FFD700" }}
      >
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "#FFD700" }}
          >
            Admin — Scoreboard
          </h1>
          <p className="text-sm mt-1" style={{ color: "#555" }}>
            {players.length} spiller{players.length !== 1 ? "e" : ""} totalt
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded text-sm transition-opacity hover:opacity-70"
            style={{ background: "#1a1a1a", color: "#aaa", border: "1px solid #333" }}
          >
            Vis scoreboard ↗
          </a>
          <button
            onClick={handleAdd}
            className="px-5 py-2 rounded font-bold text-sm transition-opacity hover:opacity-80"
            style={{ background: "#FFD700", color: "#000", cursor: "pointer" }}
          >
            + Legg til spiller
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center py-16" style={{ color: "#555" }}>
          Laster...
        </p>
      ) : (
        <PlayerTable
          players={players}
          onEdit={handleEdit}
          onDelete={setDeletingId}
          deletingId={deletingId}
          onConfirmDelete={handleConfirmDelete}
          onCancelDelete={() => setDeletingId(null)}
        />
      )}

      {/* Modal form */}
      {showForm && (
        <PlayerForm
          player={editingPlayer}
          onClose={handleCloseForm}
          onSaved={fetchPlayers}
        />
      )}
    </div>
  );
}
