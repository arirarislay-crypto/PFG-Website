import React from "react";

export default function TabSwitcher({ tabs, activeTab, onChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-6 py-2.5 font-body text-sm font-medium tracking-wide border transition-all duration-200 ${
            activeTab === tab.value
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-secondary/50 text-foreground border-border hover:border-primary/40"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}