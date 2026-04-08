import React from "react";
import { motion } from "framer-motion";

const HERO_BG = "https://media.base44.com/images/public/69d628b8c566acd8ead21552/fd57c8231_generated_2cda72ac.png";

export default function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />

      <div className="relative z-10 text-center px-4 py-20">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-7xl font-heading font-bold text-primary tracking-wider"
        >
          Pro Football Gridiron
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 text-muted-foreground font-body text-sm tracking-widest uppercase"
        >
          Football Fusion 2 [8v8]
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10"
        >
          <a
            href="https://discord.gg/3UN5J3JsHQ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-3 border-2 border-primary text-primary font-heading font-semibold text-lg tracking-wider hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Join PFG
          </a>
        </motion.div>
      </div>
    </section>
  );
}