"use client";

import React from "react";
import { Game } from "@/types/twitch";

interface SiderProps {
  topGames: Game[];
  activeGameId: string | null;
  onGameSelect: (gameId: string) => void;
  onRecommendationSelect: () => void;
}

export default function Sider({
  topGames,
  activeGameId,
  onGameSelect,
  onRecommendationSelect,
}: SiderProps) {
  // Helper: Replaces URL brackets with standard micro dimensions for image rendering
  const formatBoxArtUrl = (url: string) => {
    return url
      .replace("{width}", "44")
      .replace("{height}", "55")
      .replace("%{width}", "44")
      .replace("%{height}", "55");
  };

  return (
    <aside className="hidden md:flex h-full w-[260px] flex-col border-r border-[#1f1f23] bg-[#1f1f23]/40 backdrop-blur-md px-3 py-4 overflow-y-auto shrink-0 select-none">
      {/* Recommendation Hot Button */}
      <div className="mb-6">
        <button
          onClick={onRecommendationSelect}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
            activeGameId === null
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
              : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
          }`}
        >
          <span>👍</span>
          <span className="tracking-wide">Recommend For You!</span>
        </button>
      </div>

      {/* Popular Gaming Categories List */}
      <div className="flex flex-col flex-1">
        <div className="px-3 text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-3">
          Popular Categories
        </div>

        <div className="space-y-1">
          {topGames.map((game) => {
            const isActive = activeGameId === game.id;
            return (
              <button
                key={game.id}
                onClick={() => onGameSelect(game.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-200 cursor-pointer group ${
                  isActive
                    ? "bg-zinc-800 text-violet-400 font-bold border border-zinc-700/60"
                    : "text-zinc-300 hover:bg-zinc-800/40 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={formatBoxArtUrl(game.box_art_url)}
                    alt={game.name}
                    loading="lazy"
                    className={`h-11 w-9 rounded-md object-cover bg-zinc-900 border border-zinc-800 transition-all duration-200 ${
                      isActive
                        ? "ring-2 ring-violet-500 scale-102"
                        : "group-hover:ring-2 group-hover:ring-zinc-600 group-hover:scale-102"
                    }`}
                  />
                  <span className="text-xs truncate tracking-wide font-medium pr-2">
                    {game.name}
                  </span>
                </div>
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
