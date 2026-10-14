"use client";

import React, { useState } from "react";
import { searchGameByName } from "@/services/api";
import { TwitchItem } from "@/types/twitch";

interface CustomSearchProps {
  onSuccess: (data: Record<string, TwitchItem[]>) => void;
}

export default function CustomSearch({ onSuccess }: CustomSearchProps) {
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearchSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (query.trim() === "") return;

    setIsLoading(true);
    searchGameByName(query)
      .then((data) => {
        onSuccess(data);
        setQuery(""); // Instantly clear input bar upon successful data pull
      })
      .catch((err) => {
        console.error("Search query dropped:", err.message);
        alert(`Could not find records for category: "${query}"`);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="relative w-full max-w-sm md:max-w-md"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={
          isLoading
            ? "Searching Cloud Database..."
            : "🔍 Search platform categories..."
        }
        disabled={isLoading}
        className="w-full bg-[#2f2f35]/50 border border-zinc-800/80 rounded-xl px-4 py-2 text-xs font-medium text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:bg-[#0e0e10] transition-all duration-200"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-3 top-2.5 text-[10px] text-zinc-500 hover:text-white transition duration-150 cursor-pointer"
        >
          ✕
        </button>
      )}
    </form>
  );
}
