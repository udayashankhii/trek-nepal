
import React, { useState, useEffect, useRef } from "react";
import JungleSafariHero from "./JUngleHero";
import WildlifeStats from "./WildlifeStats";
import SafariPackages from "./SafariPackages";
import SafariExperience from "./Safari Expereince";
const JungleSafariPage = () => (
  <div className="min-h-screen">
    {/* <JungleSafariHero /> */}
    <SafariPackages />
    <WildlifeStats />
    <SafariExperience />
  </div>
);

export default JungleSafariPage;
