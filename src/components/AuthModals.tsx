"use client";

import React, { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { login, register } from "@/services/api";

interface AuthModalsProps {
  onLoginSuccess: () => void;
}

export default function AuthModals({ onLoginSuccess }: AuthModalsProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Local interactive form field registries
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const handleAuthSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setIsLoading(true);

    if (mode === "login") {
      login({ username, password })
        .then(() => {
          alert("Welcome back, Operator! 🔮");
          setIsOpen(false);
          onLoginSuccess();
          // Wipe form buffers for high security
          setUsername("");
          setPassword("");
        })
        .catch((err) => alert(`Authentication Rejected: ${err.message}`))
        .finally(() => setIsLoading(false));
    } else {
      if (!firstName.trim() || !lastName.trim()) return;
      register({
        username,
        password,
        first_name: firstName,
        last_name: lastName,
      })
        .then(() => {
          alert("Account deployed successfully! Switching to login mode... 🚀");
          setMode("login");
        })
        .catch((err) => alert(`Registration Voided: ${err.message}`))
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger Interactive Button Anchor */}
      <DialogPrimitive.Trigger asChild>
        <button className="rounded-xl bg-violet-600 px-5 py-2 text-xs font-black text-white shadow-md shadow-violet-600/20 hover:bg-violet-700 transition duration-150 cursor-pointer select-none">
          Sign In
        </button>
      </DialogPrimitive.Trigger>

      {/* Full Screen Glassmorphism Modal Portal Container */}
      <DialogPrimitive.Portal>
        {/* 1. Backdrop Blur Mask Filter */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in" />

        {/* 2. Centralized Core Focus Panel Box */}
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-sm translate-x-[-50%] translate-y-[-50%] rounded-2xl border border-zinc-800/80 bg-[#18181b]/95 backdrop-blur-md p-6 shadow-2xl focus:outline-none select-none animate-in zoom-in-95 duration-200">
          <DialogPrimitive.Title className="text-sm font-black text-white tracking-tight">
            {mode === "login" ? "Log in to Streamer" : "Create Your Account"}
          </DialogPrimitive.Title>

          <DialogPrimitive.Description className="text-[10px] font-semibold text-zinc-500 mt-0.5 mb-4">
            Securely transmit authorization cryptographic arrays back to cloud
            grids.
          </DialogPrimitive.Description>

          {/* Managed Form Elements Body */}
          <form onSubmit={handleAuthSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0e0e10] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-medium text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition duration-150"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0e0e10] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-medium text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition duration-150"
                required
              />
            </div>

            {/* Registration Specific Meta Inputs Box */}
            {mode === "register" && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-[#0e0e10] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-medium text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition duration-150"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-[#0e0e10] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-medium text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition duration-150"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-violet-600 py-3 text-xs font-black text-white shadow-md hover:bg-violet-700 transition active:scale-98 duration-150 cursor-pointer h-10 flex items-center justify-center font-semibold"
            >
              {isLoading
                ? "Synchronizing..."
                : mode === "login"
                  ? "Sign In"
                  : "Register Now"}
            </button>
          </form>

          {/* Mode Panel Transition Switch Link */}
          <div className="mt-4 border-t border-zinc-900 pt-3 text-center">
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-[11px] font-bold text-zinc-500 hover:text-violet-400 transition duration-150 cursor-pointer"
            >
              {mode === "login"
                ? "Don't have an account? Register here"
                : "Already an operator? Log in instead"}
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
