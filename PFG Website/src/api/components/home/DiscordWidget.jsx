import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Users } from "lucide-react";

const DISCORD_INVITE = "https://discord.gg/3UN5J3JsHQ";

export default function DiscordWidget() {
  return (
    <section className="py-8 px-4 pb-24">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-xl border border-[#5865F2]/30 shadow-2xl shadow-[#5865F2]/10"
        >
          {/* Header */}
          <div className="bg-[#5865F2] px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 127.14 96.36" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
              </svg>
              <div>
                <p className="text-white font-heading font-bold text-lg tracking-wide leading-none">Pro Football Gridiron</p>
                <p className="text-white/70 text-xs font-body mt-0.5">Official PFG Discord</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/90 text-xs font-body font-medium">Online</span>
            </div>
          </div>

          {/* Body */}
          <div className="bg-[#36393f] px-6 py-6 space-y-5">
            <p className="text-[#dcddde] font-body text-sm leading-relaxed">
              Join the official PFG community on Discord. Stay up to date with game schedules, announcements, team news, and connect with other players.
            </p>

            <div className="flex items-center gap-6 py-3 border-t border-white/10 border-b">
              <div className="text-center">
                <p className="text-white font-heading font-bold text-xl">PFG</p>
                <p className="text-[#b9bbbe] text-xs font-body">Server</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <p className="text-white font-heading font-bold text-xl">Active</p>
                </div>
                <p className="text-[#b9bbbe] text-xs font-body">Status</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-white" />
                  <p className="text-white font-heading font-bold text-xl">Open</p>
                </div>
                <p className="text-[#b9bbbe] text-xs font-body">Membership</p>
              </div>
            </div>

            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#5865F2] text-white font-body font-semibold rounded-lg hover:bg-[#4752c4] active:bg-[#3c45a5] transition-colors text-sm tracking-wide"
            >
              <ExternalLink className="w-4 h-4" />
              Join the PFG Discord
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}