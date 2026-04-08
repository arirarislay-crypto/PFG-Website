import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Pencil, Trash2, Plus, X, Check } from "lucide-react";

const categories = ["general", "gameplay", "conduct", "eligibility", "scoring", "other"];
const empty = { title: "", content: "", order: "", category: "general" };

export default function AdminRules() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ["admin-rules"],
    queryFn: () => base44.entities.LeagueRule.list("order"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.LeagueRule.create(data),
    onSuccess: () => { qc.invalidateQueries(["admin-rules"]); setEditing(null); setForm(empty); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.LeagueRule.update(id, data),
    onSuccess: () => { qc.invalidateQueries(["admin-rules"]); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.LeagueRule.delete(id),
    onSuccess: () => qc.invalidateQueries(["admin-rules"]),
  });

  const startEdit = (rule) => { setEditing(rule.id); setForm({ ...rule }); };
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
        <h2 className="text-xl font-heading font-semibold text-primary">League Rules</h2>
        <button onClick={startNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary/80 transition-colors">
          <Plus className="w-4 h-4" /> Add Rule
        </button>
      </div>

      {editing === "new" && (
        <RuleForm form={form} f={f} categories={categories} onSave={save} onCancel={cancel} isLoading={createMutation.isPending} />
      )}

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : rules.length === 0 ? (
          <div className="text-center py-12 border border-border text-muted-foreground">No rules yet. Click "Add Rule" to get started.</div>
        ) : rules.map((rule) => (
          editing === rule.id ? (
            <RuleForm key={rule.id} form={form} f={f} categories={categories} onSave={save} onCancel={cancel} isLoading={updateMutation.isPending} />
          ) : (
            <div key={rule.id} className="border border-border bg-card/40 p-4 flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {rule.order && <span className="text-xs text-muted-foreground font-body">#{rule.order}</span>}
                  <span className="text-xs border border-border px-2 py-0.5 text-muted-foreground font-body">{rule.category}</span>
                </div>
                <h4 className="font-heading font-semibold text-primary">{rule.title}</h4>
                <p className="text-sm text-foreground/60 font-body mt-1 line-clamp-2">{rule.content}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(rule)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => deleteMutation.mutate(rule.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

function RuleForm({ form, f, categories, onSave, onCancel, isLoading }) {
  return (
    <div className="border border-border bg-card/60 p-4 mb-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="text-xs text-muted-foreground mb-1 block">Title *</label>
          <input value={form.title} onChange={e => f("title", e.target.value)} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" placeholder="Rule title..." />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Category</label>
          <select value={form.category} onChange={e => f("category", e.target.value)} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Order #</label>
          <input type="number" value={form.order} onChange={e => f("order", Number(e.target.value))} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary" placeholder="1, 2, 3..." />
        </div>
        <div className="sm:col-span-3">
          <label className="text-xs text-muted-foreground mb-1 block">Content (Markdown supported)</label>
          <textarea value={form.content} onChange={e => f("content", e.target.value)} rows={5} className="w-full bg-input border border-border px-3 py-2 text-sm text-foreground rounded focus:outline-none focus:border-primary resize-none" placeholder="Rule content..." />
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-1">
        <button onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 border border-border text-muted-foreground text-sm hover:text-foreground transition-colors"><X className="w-4 h-4" /> Cancel</button>
        <button onClick={onSave} disabled={isLoading || !form.title} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/80 transition-colors disabled:opacity-50"><Check className="w-4 h-4" /> Save</button>
      </div>
    </div>
  );
}