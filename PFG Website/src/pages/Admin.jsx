import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AdminTeams from "../components/admin/AdminTeams";
import AdminPlayers from "../components/admin/AdminPlayers";
import AdminRules from "../components/admin/AdminRules";

const tabs = [
  { label: "Teams", value: "teams" },
  { label: "Players", value: "players" },
  { label: "Rulebook", value: "rules" },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("teams");

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-primary tracking-wider mb-2">PFG Admin Panel</h1>
        <p className="text-muted-foreground font-body mb-8">Manage league data</p>

        <div className="flex gap-2 mb-8 border-b border-border pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-5 py-2.5 font-body text-sm font-medium tracking-wide border transition-all ${
                activeTab === tab.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/50 text-foreground border-border hover:border-primary/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "teams" && <AdminTeams />}
        {activeTab === "players" && <AdminPlayers />}
        {activeTab === "rules" && <AdminRules />}
      </div>
    </div>
  );
}