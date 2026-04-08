import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Trophy, BookOpen } from "lucide-react";

const links = [
  { label: "Player Statistics", path: "/stats", icon: BarChart3 },
  { label: "Standings", path: "/standings", icon: Trophy },
  { label: "Rulebook", path: "/rulebook", icon: BookOpen },
];

export default function DashboardLinks() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border border-border bg-card/60 backdrop-blur-sm p-8"
        >
          <h2 className="text-2xl font-heading font-semibold text-primary text-center tracking-wider mb-8">
            Dashboard — Coming Soon
          </h2>

          <div className="space-y-3">
            {links.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link
                  to={link.path}
                  className="flex items-center justify-center gap-3 w-full py-3.5 border border-border bg-secondary/50 text-foreground font-body font-medium tracking-wide hover:bg-primary/10 hover:border-primary/40 transition-all duration-300"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}