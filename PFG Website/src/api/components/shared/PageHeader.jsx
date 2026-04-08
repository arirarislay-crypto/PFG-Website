import React from "react";
import { motion } from "framer-motion";

export default function PageHeader({ subtitle }) {
  return (
    <div className="text-center py-12 px-4">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-heading font-bold text-primary tracking-wider"
      >
        Pro Football Gridiron
      </motion.h1>
      {subtitle && (
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-3 text-xl font-heading font-medium text-primary/70 tracking-wide"
        >
          {subtitle}
        </motion.h2>
      )}
    </div>
  );
}