/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { TwitchItem } from "@/types/twitch";
import { addFavoriteItem, deleteFavoriteItem } from "@/services/api";

interface HomeProps {
  resources: Record<string, TwitchItem[]>;
  loggedIn: boolean;
  favoriteItems: Record<string, TwitchItem[]>;
  onFavoriteChange: () => void;
  isLoading: boolean; // Managed data loader pulse trigger from master controller
}

export default function Home({
  resources,
  loggedIn,
  favoriteItems,
  onFavoriteChange,
  isLoading,
}: HomeProps) {
  const [activeTab, setActiveTab] = useState<"streams" | "videos" | "clips">(
    "streams",
  );
  const { streams = [], videos = [], clips = [] } = resources;

  // Dynamic resolution wildcard parsing utility matching live CDN streams
  const formatThumbnailUrl = (url: string) => {
    return url
      .replace("%{height}", "248")
      .replace("%{width}", "440")
      .replace("{height}", "248")
      .replace("{width}", "440");
  };

  const handleToggleFavorite = (item: TwitchItem, isAlreadyFav: boolean) => {
    const apiAction = isAlreadyFav
      ? deleteFavoriteItem(item)
      : addFavoriteItem(item);

    apiAction
      .then(() => onFavoriteChange())
      .catch((err) => alert(`Favorite sync dropped: ${err.message}`));
  };

  // Flatten cloud collection lists safely using strict twitch_id parameters
  const userFavIds = new Set(
    [
      ...(favoriteItems.streams || []),
      ...(favoriteItems.videos || []),
      ...(favoriteItems.clips || []),
    ].map((fav) => fav.twitch_id),
  );

  const getActiveData = () => {
    if (activeTab === "videos") return videos;
    if (activeTab === "clips") return clips;
    return streams;
  };

  const currentList = getActiveData();

  return (
    <div className="w-full flex flex-col select-none">
      {/* Cyberpunk Interactive Navigation Tabs Switcher Bar */}
      <div className="flex items-center gap-2 border-b border-[#1f1f23] mb-6 pb-2">
        {(["streams", "videos", "clips"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black capitalize transition-all duration-200 cursor-pointer ${
              activeTab === tab
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic Grid Layout Layer: Swaps smoothly between Skeletons or Active Content Feeds */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {isLoading
          ? /* 🚀 VISUAL DEFENSE 1: RENDER SHIMMER SKELETON PLACEHOLDERS DURING FETCH */
            Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="bg-[#18181b] rounded-2xl border border-zinc-900/60 p-4 space-y-4 animate-pulse h-[280px]"
              >
                <div className="aspect-video w-full rounded-xl bg-zinc-900" />
                <div className="space-y-2">
                  <div className="h-3 w-3/4 rounded bg-zinc-900" />
                  <div className="h-2 w-1/2 rounded bg-zinc-900" />
                </div>
              </div>
            ))
          : /* RENDER ACTIVE LIVE INTERFACE STREAMS ONCE THE API DATA SETTLES */
            currentList.map((item) => {
              const isFav = userFavIds.has(item.twitch_id);

              return (
                <div
                  key={`${item.item_type}-${item.twitch_id}`}
                  className="group bg-[#18181b] rounded-2xl border border-zinc-900/60 overflow-hidden shadow-md hover:border-zinc-800 transition-all duration-200 flex flex-col h-full"
                >
                  {/* Image Frame Wrapper */}
                  <div className="relative w-full aspect-video bg-zinc-950 overflow-hidden animate-pulse">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full"
                    >
                      <img
                        src={formatThumbnailUrl(item.thumbnail_url)}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:scale-103 bg-zinc-900"
                        onLoad={(e) => {
                          /* 🚀 VISUAL DEFENSE 2: REVEAL CDN SOURCE AND STRIP SKELETON GRADIENT ON COMPLETE */
                          const target = e.currentTarget;
                          target.classList.remove("opacity-0");
                          target.parentElement?.parentElement?.classList.remove(
                            "animate-pulse",
                          );
                        }}
                      />
                    </a>

                    {loggedIn && (
                      <button
                        onClick={() => handleToggleFavorite(item, isFav)}
                        title={
                          isFav
                            ? "Remove from my favorites"
                            : "Save to my favorites"
                        }
                        className={`absolute top-3 right-3 h-8 w-8 rounded-xl flex items-center justify-center text-sm shadow-md backdrop-blur-md transition-all duration-150 cursor-pointer active:scale-90 z-10 ${
                          isFav
                            ? "bg-violet-600 text-white"
                            : "bg-black/40 text-zinc-400 hover:bg-black/60 hover:text-amber-400 border border-white/5"
                        }`}
                      >
                        ★
                      </button>
                    )}
                  </div>

                  {/* Metadata Details Layout */}
                  <div className="p-4 flex flex-col flex-grow justify-between min-w-0">
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-white truncate group-hover:text-violet-400 transition duration-150">
                        {item.title}
                      </h4>
                      <p className="text-xs font-semibold text-zinc-500 mt-1 truncate">
                        👤 {item.broadcaster_name}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider ${
                          item.item_type === "STREAM"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/10"
                            : item.item_type === "VIDEO"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/10"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                        }`}
                      >
                        {item.item_type}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Empty Fallback Block */}
      {!isLoading && currentList.length === 0 && (
        <div className="text-center py-20 bg-[#18181b]/30 rounded-2xl border border-dashed border-zinc-900">
          <p className="text-sm font-bold text-zinc-600">
            No active {activeTab} materials currently compiled for this channel.
            🛸
          </p>
        </div>
      )}
    </div>
  );
}
