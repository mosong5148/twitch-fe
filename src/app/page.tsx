"use client";

import React, { useState, useEffect } from "react";
import { Game, TwitchItem } from "@/types/twitch";
import {
  getTopGames,
  searchGameById,
  getRecommendations,
  getFavoriteItem,
} from "@/services/api";
import Sider from "@/components/Sider";
import CustomSearch from "@/components/CustomSearch";
import Home from "@/components/Home";
import AuthModals from "@/components/AuthModals";
import Favorites from "@/components/Favorites";

export default function DashboardHomePage() {
  // 1. Centralized Core System Communication Registries
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [topGames, setTopGames] = useState<Game[]>([]);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  // Visual Defense Pulse Loading Identifier
  const [isGridLoading, setIsGridLoading] = useState<boolean>(false);

  // Master display repositories mapping active lists to local client cache memory
  const [resources, setResources] = useState<Record<string, TwitchItem[]>>({
    streams: [],
    videos: [],
    clips: [],
  });

  const [favoriteItems, setFavoriteItems] = useState<
    Record<string, TwitchItem[]>
  >({
    streams: [],
    videos: [],
    clips: [],
  });

  // Helper Sync Routine: Re-fetch user cloud saved collection ledgers from Google Cloud
  const syncFavoritesCollection = (): void => {
    getFavoriteItem()
      .then((data) => setFavoriteItems(data))
      .catch((err) =>
        console.error("Cloud collections sync dropped:", err.message),
      );
  };

  // 2. Fetch Global Taxonomy Seeds & Recommendations on Initial Mount Phase
  useEffect(() => {
    getTopGames()
      .then((data) => setTopGames(data))
      .catch((err) => console.error("Taxonomy syncing dropped:", err.message));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsGridLoading(true);
    getRecommendations()
      .then((data) => setResources(data))
      .catch((err) =>
        console.error("Recommendation stream mapping failed:", err.message),
      )
      .finally(() => setIsGridLoading(false));
  }, []);

  // 3. User Authentication Response Interceptors
  const handleLoginSuccess = (): void => {
    setLoggedIn(true);
    syncFavoritesCollection(); // Instantly download cloud favorites logs upon validation success
  };

  const handleLogoutClick = (): void => {
    // Standard secure clear: Flush memory states and delete local registries
    setLoggedIn(false);
    setFavoriteItems({ streams: [], videos: [], clips: [] });
    alert(
      "Logged out successfully! Private session cookies dropped securely. 🔒",
    );
  };

  const handleGameSelect = (gameId: string): void => {
    setActiveGameId(gameId);
    setIsGridLoading(true); // Activate shimmering shader masks instantly
    searchGameById(gameId)
      .then((data) => setResources(data))
      .catch((err) =>
        console.error("Category grid lookup dropped:", err.message),
      )
      .finally(() => setIsGridLoading(false)); // Release skeletons once payload arrives
  };

  const handleSearchSuccess = (
    searchResults: Record<string, TwitchItem[]>,
  ): void => {
    setActiveGameId(null); // Clear side focus highlights
    setResources(searchResults);
  };

  const handleRecommendationSelect = (): void => {
    setActiveGameId(null);
    setIsGridLoading(true);
    getRecommendations()
      .then((data) => setResources(data))
      .catch((err) =>
        console.error("Algorithmic matrix update failed:", err.message),
      )
      .finally(() => setIsGridLoading(false));
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#0e0e10] text-[#efeff1]">
      {/* Immersive Sticky Navigation Header Panel */}
      <header className="flex h-16 w-full items-center justify-between border-b border-[#1f1f23] bg-[#18181b] px-6 shadow-md z-50 select-none shrink-0">
        <div
          onClick={handleRecommendationSelect}
          className="flex items-center gap-2 font-black text-violet-500 text-lg tracking-tighter cursor-pointer"
        >
          🔮 <span>STREAMER</span>
        </div>

        {/* Integrated Command Search Input Component */}
        <CustomSearch onSuccess={handleSearchSuccess} />

        {/* Dynamic Auth Controller Gateways */}
        <div className="flex items-center gap-3">
          {loggedIn ? (
            <div className="flex items-center gap-3 animate-in fade-in duration-200">
              {/* INTEGRATED COMPONENT 1: Connected Cloud Favorites Drawer */}
              <Favorites
                favoriteItems={favoriteItems}
                onFavoriteChange={syncFavoritesCollection}
              />

              <button
                onClick={handleLogoutClick}
                className="rounded-xl bg-zinc-800 border border-zinc-700/60 px-4 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-700 hover:text-white transition duration-150 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            /* INTEGRATED COMPONENT 2: Accessible Frosted Glass Auth Portal Modal Dialog */
            <AuthModals onLoginSuccess={handleLoginSuccess} />
          )}
        </div>
      </header>

      {/* Main Working Split Viewport Dashboard Environments */}
      <div className="flex flex-1 w-full overflow-hidden">
        <Sider
          topGames={topGames}
          activeGameId={activeGameId}
          onGameSelect={handleGameSelect}
          onRecommendationSelect={handleRecommendationSelect}
        />

        <main className="flex-1 h-full p-6 md:p-8 overflow-y-auto bg-[#0e0e10]">
          <div className="mb-6 select-none">
            <h2 className="text-xl font-black tracking-tight text-white">
              Live Broadcast Network
            </h2>
            <p className="text-xs font-medium text-zinc-500 mt-0.5">
              Explore active streams, curated clips, and popular videos below.
            </p>
          </div>
          {/* Operational Content Grid Matrix Viewport */}
          <Home
            resources={resources}
            loggedIn={loggedIn}
            favoriteItems={favoriteItems}
            onFavoriteChange={syncFavoritesCollection}
            isLoading={isGridLoading} // Fully binding the data pulse loading trigger
          />
        </main>
      </div>
    </div>
  );
}
