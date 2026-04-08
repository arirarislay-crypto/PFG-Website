import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import PageHeader from "../components/shared/PageHeader";
import TabSwitcher from "../components/shared/TabSwitcher";

const seriesTabs = [
  { label: "Season", value: "season" },
  { label: "Series 1", value: "series_1" },
  { label: "Series 2", value: "series_2" },
];

export default function Standings() {
  const [activeSeries, setActiveSeries] = useState("season");

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ["teams", activeSeries],
    queryFn: () => base44.entities.Team.filter({ series: activeSeries }, "-points"),
  });

  const getWinPct = (wins, losses) => {
    const total = wins + losses;
    if (total === 0) return ".000";
    return (wins / total).toFixed(3).replace(/^0/, "");
  };

  return (
    <div className="min-h-screen">
      <PageHeader subtitle="Standings Overview" />

      <div className="max-w-6xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-border bg-card/40 p-6 mb-8"
        >
          <p className="text-sm text-muted-foreground font-body text-center leading-relaxed">
            Points are determined directly by wins, with wins giving more points if you are in a higher division.
            Rank / seed is done series by series and is only determined by wins / PD and is only used to determine
            division changes between series.
          </p>
        </motion.div>

        <div className="mb-8">
          <TabSwitcher tabs={seriesTabs} activeTab={activeSeries} onChange={setActiveSeries} />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-center text-2xl font-heading font-semibold text-primary tracking-wider mb-6">
            {seriesTabs.find((t) => t.value === activeSeries)?.label}
          </h3>

          <div className="border-t-2 border-primary mb-6" />

          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="text-primary/80 border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold tracking-wide">Team</th>
                  <th className="text-center py-3 px-2 font-semibold tracking-wide">Division</th>
                  <th className="text-center py-3 px-2 font-semibold tracking-wide">Rank / Seed</th>
                  <th className="text-center py-3 px-2 font-semibold tracking-wide">Record</th>
                  <th className="text-center py-3 px-2 font-semibold tracking-wide">Win PCT</th>
                  <th className="text-center py-3 px-2 font-semibold tracking-wide">PD</th>
                  <th className="text-center py-3 px-2 font-semibold tracking-wide">Points</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/30">
                      <td colSpan={7} className="py-4 px-4">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : teams.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-muted-foreground">
                      No standings data available yet
                    </td>
                  </tr>
                ) : (
                  teams.map((team, i) => (
                    <motion.tr
                      key={team.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/20 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {team.logo_url && (
                            <img src={team.logo_url} className="w-6 h-6 rounded-full" alt="" />
                          )}
                          <span className="font-medium text-foreground">{team.name}</span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-2 text-foreground/80">{team.division}</td>
                      <td className="text-center py-3 px-2 text-foreground/80">
                        {team.rank} / {team.seed}
                      </td>
                      <td className="text-center py-3 px-2 text-foreground/80">
                        {team.wins} – {team.losses}
                      </td>
                      <td className="text-center py-3 px-2 text-foreground/80">
                        {getWinPct(team.wins || 0, team.losses || 0)}
                      </td>
                      <td className="text-center py-3 px-2 text-foreground/80">{team.point_differential}</td>
                      <td className="text-center py-3 px-2 text-foreground font-semibold">{team.points}</td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}