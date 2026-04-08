import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import PageHeader from "../components/shared/PageHeader";

export default function Rulebook() {
  const { data: rules = [], isLoading } = useQuery({
    queryKey: ["rules"],
    queryFn: () => base44.entities.LeagueRule.list("order"),
  });

  return (
    <div className="min-h-screen">
      <PageHeader subtitle="League Regulations" />

      <div className="max-w-4xl mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border border-border bg-card/40 p-6">
                <div className="h-5 w-48 bg-muted rounded animate-pulse mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : rules.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body text-lg">
              League regulations will be posted here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {rules.map((rule, i) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="border border-border bg-card/40 p-6"
              >
                <h3 className="text-lg font-heading font-semibold text-primary tracking-wide mb-4">
                  {rule.order ? `${rule.order}. ` : ""}{rule.title}
                </h3>
                <div className="prose prose-sm prose-invert max-w-none text-foreground/80 font-body leading-relaxed">
                  <ReactMarkdown>{rule.content}</ReactMarkdown>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}