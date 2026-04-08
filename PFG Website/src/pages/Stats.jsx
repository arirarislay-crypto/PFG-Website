import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import PageHeader from "../components/shared/PageHeader";
import TabSwitcher from "../components/shared/TabSwitcher";

const timeTabs = [
  { label: "Season", value: "season" },
  { label: "All-Time", value: "all_time" },
];

const positionTabs = [
  { label: "QB", value: "QB" },
  { label: "RB", value: "RB" },
  { label: "WR", value: "WR" },
  { label: "DB", value: "DB" },
  { label: "DEF", value: "DEF" },
  { label: "Legacy", value: "Legacy" },
];

const columnsByPosition = {
  QB: ["Rank", "Username", "Division", "Rating", "Comp %", "Comp", "Att", "Yards", "YPA", "TDs", "INTs", "Sacks", "GP"],
  RB: ["Rank", "Username", "Division", "Rating", "Yards", "Att", "YPA", "TDs", "Receptions", "GP"],
  WR: ["Rank", "Username", "Division", "Rating", "Yards", "Receptions", "Targets", "TDs", "GP"],
  DB: ["Rank", "Username", "Division", "Rating", "INTs", "Tackles", "GP"],
  DEF: ["Rank", "Username", "Division", "Rating", "Sacks", "Tackles", "Forced Fumbles", "GP"],
  Legacy: ["Rank", "Username", "Division", "Rating", "Yards", "TDs", "GP"],
};

function getFieldValue(player, col) {
  const map = {
    "Rank": player.rank,
    "Username": player.username,
    "Division": player.division,
    "Rating": player.rating,
    "Comp %": player.comp_pct,
    "Comp": player.completions,
    "Att": player.attempts,
    "Yards": player.yards,
    "YPA": player.ypa,
    "TDs": player.touchdowns,
    "INTs": player.interceptions,
    "Sacks": player.sacks,
    "GP": player.games_played,
    "Receptions": player.receptions,
    "Targets": player.targets,
    "Tackles": player.tackles,
    "Forced Fumbles": player.forced_fumbles,
  };
  return map[col] ?? "–";
}

export default function Stats() {
  const [timeRange, setTimeRange] = useState("season");
  const [position, setPosition] = useState("QB");

  const { data: players = [], isLoading } = useQuery({
    queryKey: ["players", timeRange, position],
    queryFn: () => base44.entities.Player.filter({ stat_type: timeRange, position }, "rank"),
  });

  const columns = columnsByPosition[position] || [];

  return (
    <div className="min-h-screen">
      <PageHeader subtitle="Season Stats" />

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <p className="text-center text-sm text-muted-foreground/60 italic font-body mb-6">
          Updated regularly
        </p>

        <div className="mb-6">
          <TabSwitcher tabs={timeTabs} activeTab={timeRange} onChange={setTimeRange} />
        </div>

        <div className="mb-8">
          <TabSwitcher tabs={positionTabs} activeTab={position} onChange={setPosition} />
        </div>

        <motion.div
          key={`${timeRange}-${position}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="overflow-x-auto"
        >
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="text-primary/80 border-b border-border">
                {columns.map((col) => (
                  <th
                    key={col}
                    className={`py-3 px-3 font-semibold tracking-wide whitespace-nowrap ${
                      col === "Username" ? "text-left" : "text-center"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/30">
                    <td colSpan={columns.length} className="py-4 px-4">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : players.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12 text-muted-foreground">
                    No player statistics available yet
                  </td>
                </tr>
              ) : (
                players.map((player, i) => (
                  <motion.tr
                    key={player.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border/20 hover:bg-secondary/30 transition-colors"
                  >
                    {columns.map((col) => (
                      <td
                        key={col}
                        className={`py-3 px-3 whitespace-nowrap ${
                          col === "Username"
                            ? "text-left font-medium text-foreground"
                            : "text-center text-foreground/80"
                        }`}
                      >
                        {getFieldValue(player, col)}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}