"use client";

import { useState, useEffect } from "react";
import type { AdminPlayer } from "@/lib/types";

type FormData = {
  name: string;
  score: string;
  age: string;
  email: string;
  phone: string;
};

const empty: FormData = { name: "", score: "0", age: "", email: "", phone: "" };

export default function PlayerForm({
  player,
  onClose,
  onSaved,
}: {
  player: AdminPlayer | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<FormData>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (player) {
      setForm({
        name: player.name,
        score: String(player.score),
        age: player.age != null ? String(player.age) : "",
        email: player.email ?? "",
        phone: player.phone ?? "",
      });
    } else {
      setForm(empty);
    }
    setError("");
  }, [player]);

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Navn er påkrevd");
      return;
    }
    setSaving(true);
    setError("");

    const body = {
      name: form.name.trim(),
      score: parseInt(form.score, 10) || 0,
      age: form.age ? parseInt(form.age, 10) : null,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
    };

    try {
      const url = player ? `/api/players/${player.id}` : "/api/players";
      const method = player ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Noe gikk galt");
        return;
      }
      onSaved();
      onClose();
    } catch {
      setError("Noe gikk galt");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-lg p-8"
        style={{ background: "#111", border: "1px solid #333" }}
      >
        <h2
          className="text-lg font-bold mb-6"
          style={{ color: "#FFD700", fontFamily: "monospace" }}
        >
          {player ? "Rediger spiller" : "Legg til spiller"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field
            label="Navn *"
            value={form.name}
            onChange={(v) => set("name", v)}
            required
          />
          <Field
            label="Score"
            type="number"
            value={form.score}
            onChange={(v) => set("score", v)}
          />
          <div className="border-t border-[#222] pt-4">
            <p
              className="text-xs mb-3"
              style={{ color: "#666", fontFamily: "monospace" }}
            >
              Kun synlig i admin
            </p>
            <div className="flex flex-col gap-4">
              <Field
                label="Alder"
                type="number"
                value={form.age}
                onChange={(v) => set("age", v)}
              />
              <Field
                label="E-post"
                type="email"
                value={form.email}
                onChange={(v) => set("email", v)}
              />
              <Field
                label="Telefon"
                type="tel"
                value={form.phone}
                onChange={(v) => set("phone", v)}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm" style={{ color: "#ff4444" }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 rounded font-bold text-sm transition-opacity disabled:opacity-50"
              style={{
                background: "#FFD700",
                color: "#000",
                fontFamily: "monospace",
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Lagrer..." : player ? "Lagre" : "Legg til"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-sm"
              style={{
                background: "#222",
                color: "#aaa",
                fontFamily: "monospace",
                cursor: "pointer",
              }}
            >
              Avbryt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs" style={{ color: "#888", fontFamily: "monospace" }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="rounded px-3 py-2 text-sm outline-none w-full"
        style={{
          background: "#1a1a1a",
          border: "1px solid #333",
          color: "#fff",
          fontFamily: "monospace",
        }}
      />
    </label>
  );
}
