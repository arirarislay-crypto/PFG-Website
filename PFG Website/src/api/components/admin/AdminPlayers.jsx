import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Pencil, Trash2, Plus, X, Check } from "lucide-react";

const positions = ["QB", "RB", "WR", "DB", "DEF", "Legacy"];
const empty = { username: "", position: "QB", division: 1, rank: "", rating: "", comp_pct: "", completions: "", attempts: "", yards: "", ypa: "", touchdowns: "", interceptions: "", sacks: "", games_played: "", receptions: "", targets: "", tackles: "", forced_fumbles: "", stat_type: "season", team_name: "" };

export default function AdminPlayers() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [filterPos, setFilterPos] = useState("QB");

  const { data: players = [], isLoading } = useQuery({
    queryKey: ["admin-players"],
    queryFn: () => base44.entities.Player.list("rank"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Player.create(data),
    onSuccess: () => { qc.invalidateQueries(["admin-players"]); setEditing(null); setForm(empty); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Player.update(id, data),
    onSuccess: () => { qc.invalidateQueries(["admin-players"]); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Player.delete(id),
    onSuccess: () => qc.invalidateQueries(["admin-players"]),
  });

  const startEdit = (p) => { setEditing(p.id); setForm({ ...p }); };
  const startNew = () => { setEditing("new"); setForm({ ...empty, position: filterPos }); };
  const cancel = () => { setEditing(null); setForm(empty); };
  const save = () => {
    if (editing === "new") createMutation.mutate(form);
    else updateMutation.mutate({ id: editing, data: form });
  };
  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const filtered = players.filter(p => p.position === filterPos);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-heading font-semibold text-primary">Players</h2>
        <button onClick={startNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary/80 transition-colors">
          <Plus className="w-4 h-4" /> Add Player
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {positions.map(pos => (
          <button key={pos} onClick={() => setFilterPos(pos)}
            className={`px-4 py-1.5 text-sm font-body border transition-all ${filterPos === pos ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
            {pos}
          </button>
        ))}
      </div>

      {editing === "new" && (
        <PlayerForm form={form} f={f} positions={positions} onSave={save} onCancel={cancel} isLoading={createMutation.isPending} />
      )}

      <div className="border border-border overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border bg-secondary/30 text-primary/80">
              <th className="text-left px-4 py-3">Username</th>
              <th className="text-center px-2 py-3">Pos</th>
              <th className="text-center px-2 py-3">Div</th>
              <th className="text-center px-2 py-3">Rank</th>
              <th className="text-center px-2 py-3">Rating</th>
              <th className="text-center px-2 py-3">Yards</th>
              <th className="text-center px-2 py-3">TDs</th>
              <th className="text-center px-2 py-3">Type</th>
              <th className="px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={9} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-8 text-muted-foreground">No {filterPos} players yet</td></tr>
            ) : filtered.map((player) => (
              editing === player.id ? (
                <tr key={player.id} className="border-b border-border bg-secondary/20">
                  <td colSpan={9} className="p-4">
                    <PlayerForm form={form} f={f} positions={positions} onSave={save} onCancel={cancel} isLoading={updateMutation.isPending} />
                  </td>
                </tr>
              ) : (
                <tr key={player.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{player.username}</td>
                  <td className="text-center px-2 py-3 text-foreground/70">{player.position}</td>
                  <td className="text-center px-2 py-3 text-foreground/70">{player.division}</td>
                  <td className="text-center px-2 py-3 text-foreground/70">{player.rank}</td>
                  <td className="text-center px-2 py-3 text-foreground/70">{player.rating}</td>
                  <td className="text-center px-2 py-3 text-foreground/70">{player.yards}</td>
                  <td className="text-center px-2 py-3 text-foreground/70">{player.touchdowns}</td>
                  <td className="text-center px-2 py-3 text-foreground/70">{player.stat_type}</td>
                  <td className="px-2 py-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => startEdit(player)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => deleteMutation.mutate(player.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlayerForm({ form, f, positions, onSave, onCancel, isLoading }) {
  return (
    <div className="border border-border bg-card/60 p-4 mb-4 space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Username *</label>
          <input value={form.username} onChange={e => f("username", e.target.value)} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Position</label>
          <select value={form.position} onChange={e => f("position", e.target.value)} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary">
            {positions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Stat Type</label>
          <select value={form.stat_type} onChange={e => f("stat_type", e.target.value)} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary">
            <option value="season">Season</option>
            <option value="all_time">All-Time</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Team</label>
          <input value={form.team_name} onChange={e => f("team_name", e.target.value)} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Division</label>
          <input type="number" value={form.division} onChange={e => f("division", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Rank</label>
          <input type="number" value={form.rank} onChange={e => f("rank", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Rating</label>
          <input type="number" value={form.rating} onChange={e => f("rating", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Comp %</label>
          <input type="number" value={form.comp_pct} onChange={e => f("comp_pct", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Completions</label>
          <input type="number" value={form.completions} onChange={e => f("completions", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Attempts</label>
          <input type="number" value={form.attempts} onChange={e => f("attempts", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Yards</label>
          <input type="number" value={form.yards} onChange={e => f("yards", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">YPA</label>
          <input type="number" value={form.ypa} onChange={e => f("ypa", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">TDs</label>
          <input type="number" value={form.touchdowns} onChange={e => f("touchdowns", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">INTs</label>
          <input type="number" value={form.interceptions} onChange={e => f("interceptions", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Sacks</label>
          <input type="number" value={form.sacks} onChange={e => f("sacks", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Games Played</label>
          <input type="number" value={form.games_played} onChange={e => f("games_played", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Receptions</label>
          <input type="number" value={form.receptions} onChange={e => f("receptions", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Targets</label>
          <input type="number" value={form.targets} onChange={e => f("targets", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Tackles</label>
          <input type="number" value={form.tackles} onChange={e => f("tackles", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Forced Fumbles</label>
          <input type="number" value={form.forced_fumbles} onChange={e => f("forced_fumbles", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-1">
        <button onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 border border-border text-muted-foreground text-sm hover:text-foreground transition-colors"><X className="w-4 h-4" /> Cancel</button>
        <button onClick={onSave} disabled={isLoading || !form.username} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/80 transition-colors disabled:opacity-50"><Check className="w-4 h-4" /> Save</button>
      </div>
    </div>
  );
}