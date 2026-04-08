import React from "react";
import HeroSection from "../components/home/HeroSection";
import DashboardLinks from "../components/home/DashboardLinks";
import DiscordWidget from "../components/home/DiscordWidget";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <DashboardLinks />
      <DiscordWidget />
    </div>
  );
}