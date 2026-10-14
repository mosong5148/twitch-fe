/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { TwitchItem } from "@/types/twitch";
import { deleteFavoriteItem } from "@/services/api";

interface FavoritesProps {
  favoriteItems: Record<string, TwitchItem[]>;
  onFavoriteChange: () => void; // 🚀 ADDED: Hook parent lifting sync state handler
}

export default function Favorites({
  favoriteItems,
  onFavoriteChange,
}: FavoritesProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const { streams = [], videos = [], clips = [] } = favoriteItems;

  // Compact CDN picture optimizer routing utility
  const formatMicroThumbnail = (url: string) => {
    return url
      .replace("%{height}", "60")
      .replace("%{width}", "100")
      .replace("{height}", "60")
      .replace("{width}", "100");
  };

  const allFavorites = [...streams, ...videos, ...clips];

  // 🚀 ADDED: Deletion executor mirroring the corrected flat payload architecture
  const handleRemoveFavorite = (e: React.MouseEvent, item: TwitchItem) => {
    e.preventDefault(); // Stop anchor hyperlink triggers
    e.stopPropagation();

    setIsDeletingId(item.twitch_id);

    deleteFavoriteItem(item)
      .then(() => {
        // Instantly update parent caches to trigger simultaneous Home.tsx stars updating
        onFavoriteChange();
      })
      .catch((err) => alert(`Purge command failed: ${err.message}`))
      .finally(() => setIsDeletingId(null));
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      {/* Floating Trigger Button Anchor */}
      <DialogPrimitive.Trigger asChild>
        <button className="rounded-xl bg-zinc-800 border border-zinc-700/60 px-4 py-2 text-xs font-bold text-zinc-200 hover:bg-zinc-700 transition duration-150 cursor-pointer select-none">
          ★ My Favorites
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        {/* Backdrop Blur Mask overlay */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in" />

        {/* Right Sliding Panel Window Body Container */}
        <DialogPrimitive.Content className="fixed bottom-0 right-0 top-0 z-50 h-full w-full max-w-sm border-l border-zinc-800 bg-[#18181b]/95 backdrop-blur-md p-6 shadow-2xl focus:outline-none flex flex-col select-none animate-in slide-in-from-right duration-300">
          {/* Header Interface Sections */}
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4">
            <DialogPrimitive.Title className="text-sm font-black text-white tracking-tight">
              My Saved Collections ({allFavorites.length})
            </DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <button className="text-zinc-500 hover:text-white text-xs font-bold p-1 cursor-pointer">
                ✕
              </button>
            </DialogPrimitive.Close>
          </div>

          {/* Scrollable Ledger Output Rows Area */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {allFavorites.map((item) => (
              <a
                key={`${item.item_type}-${item.twitch_id}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-xl bg-[#0e0e10]/40 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40 transition duration-150 group min-w-0 gap-2"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Image Optimizer Frame: Aspect video lock + Shimmer animation */}
                  <div className="relative w-16 h-10 rounded-md overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800 aspect-video animate-pulse">
                    <img
                      src={formatMicroThumbnail(item.thumbnail_url)}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:scale-105"
                      onLoad={(e) => {
                        const target = e.currentTarget;
                        target.classList.remove("opacity-0");
                        target.parentElement?.classList.remove("animate-pulse");
                      }}
                    />
                  </div>

                  {/* Text Context */}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate group-hover:text-violet-400 transition duration-150">
                      {item.title}
                    </p>
                    <p className="text-[10px] font-semibold text-zinc-500 truncate mt-0.5">
                      👤 {item.broadcaster_name}
                    </p>
                  </div>
                </div>

                {/* 🚀 QUICK DELETE BUTTON ANCHOR */}
                <button
                  onClick={(e) => handleRemoveFavorite(e, item)}
                  disabled={isDeletingId === item.twitch_id}
                  title="Remove from favorites"
                  className="h-7 w-7 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-500/30 transition flex items-center justify-center text-[10px] font-black shrink-0 cursor-pointer disabled:opacity-40"
                >
                  {isDeletingId === item.twitch_id ? "..." : "✕"}
                </button>
              </a>
            ))}

            {allFavorites.length === 0 && (
              <div className="text-center py-20 text-zinc-600 font-bold text-xs border border-dashed border-zinc-900 rounded-xl bg-[#0e0e10]/10">
                Your catalog vault is empty. ★
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
