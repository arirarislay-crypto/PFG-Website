import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Pencil, Trash2, Plus, X, Check } from "lucide-react";

const empty = { name: "", division: 1, rank: "", seed: "", wins: 0, losses: 0, point_differential: 0, points: 0, logo_url: "", series: "season" };
const seriesOptions = ["season", "series_1", "series_2"];

export default function AdminTeams() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null); // null | "new" | team object
  const [form, setForm] = useState(empty);

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ["admin-teams"],
    queryFn: () => base44.entities.Team.list("-points"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Team.create(data),
    onSuccess: () => { qc.invalidateQueries(["admin-teams"]); setEditing(null); setForm(empty); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Team.update(id, data),
    onSuccess: () => { qc.invalidateQueries(["admin-teams"]); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Team.delete(id),
    onSuccess: () => qc.invalidateQueries(["admin-teams"]),
  });

  const startEdit = (team) => { setEditing(team.id); setForm({ ...team }); };
  const startNew = () => { setEditing("new"); setForm(empty); };
  const cancel = () => { setEditing(null); setForm(empty); };

  const save = () => {
    if (editing === "new") createMutation.mutate(form);
    else updateMutation.mutate({ id: editing, data: form });
  };

  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-heading font-semibold text-primary">Teams</h2>
        <button onClick={startNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary/80 transition-colors">
          <Plus className="w-4 h-4" /> Add Team
        </button>
      </div>

      {(editing === "new") && (
        <TeamForm form={form} f={f} seriesOptions={seriesOptions} onSave={save} onCancel={cancel} isLoading={createMutation.isPending} />
      )}

      <div className="border border-border overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border bg-secondary/30 text-primary/80">
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-center px-2 py-3">Division</th>
              <th className="text-center px-2 py-3">Series</th>
              <th className="text-center px-2 py-3">W</th>
              <th className="text-center px-2 py-3">L</th>
              <th className="text-center px-2 py-3">PD</th>
              <th className="text-center px-2 py-3">Pts</th>
              <th className="text-center px-2 py-3">Rank/Seed</th>
              <th className="px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={9} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
            ) : teams.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-8 text-muted-foreground">No teams yet</td></tr>
            ) : teams.map((team) => (
              editing === team.id ? (
                <tr key={team.id} className="border-b border-border bg-secondary/20">
                  <td colSpan={9} className="p-4">
                    <TeamForm form={form} f={f} seriesOptions={seriesOptions} onSave={save} onCancel={cancel} isLoading={updateMutation.isPending} />
                  </td>
                </tr>
              ) : (
                <tr key={team.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{team.name}</td>
                  <td className="text-center px-2 py-3 text-foreground/70">{team.division}</td>
                  <td className="text-center px-2 py-3 text-foreground/70">{team.series?.replace("_", " ")}</td>
                  <td className="text-center px-2 py-3 text-foreground/70">{team.wins}</td>
                  <td className="text-center px-2 py-3 text-foreground/70">{team.losses}</td>
                  <td className="text-center px-2 py-3 text-foreground/70">{team.point_differential}</td>
                  <td className="text-center px-2 py-3 text-foreground/70">{team.points}</td>
                  <td className="text-center px-2 py-3 text-foreground/70">{team.rank}/{team.seed}</td>
                  <td className="px-2 py-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => startEdit(team)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => deleteMutation.mutate(team.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
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

function TeamForm({ form, f, seriesOptions, onSave, onCancel, isLoading }) {
  return (
    <div className="border border-border bg-card/60 p-4 mb-4 space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Team Name *</label>
          <input value={form.name} onChange={e => f("name", e.target.value)} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" placeholder="e.g. Bulldogs" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Division</label>
          <input type="number" value={form.division} onChange={e => f("division", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Series</label>
          <select value={form.series} onChange={e => f("series", e.target.value)} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary">
            {seriesOptions.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Wins</label>
          <input type="number" value={form.wins} onChange={e => f("wins", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Losses</label>
          <input type="number" value={form.losses} onChange={e => f("losses", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Point Diff</label>
          <input type="number" value={form.point_differential} onChange={e => f("point_differential", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Points</label>
          <input type="number" value={form.points} onChange={e => f("points", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Rank</label>
          <input type="number" value={form.rank} onChange={e => f("rank", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Seed</label>
          <input type="number" value={form.seed} onChange={e => f("seed", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-muted-foreground mb-1 block">Logo URL</label>
          <input value={form.logo_url} onChange={e => f("logo_url", e.target.value)} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" placeholder="https://..." />
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-1">
        <button onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 border border-border text-muted-foreground text-sm hover:text-foreground transition-colors"><X className="w-4 h-4" /> Cancel</button>
        <button onClick={onSave} disabled={isLoading || !form.name} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/80 transition-colors disabled:opacity-50"><Check className="w-4 h-4" /> Save</button>
      </div>
    </div>
  );
}