"use client";

import { useEffect, useRef, useState } from "react";
import { Language, languageLabel, setLanguage as persistLanguage } from "@/lib/i18n";

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function LanguageMenu({
  lang,
  onChange,
  size = "sm",
  direction = "up",
}: {
  lang: Language;
  onChange: (next: Language) => void;
  size?: "sm" | "md";
  direction?: "up" | "down";
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && el.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const triggerCls =
    size === "sm"
      ? "rounded-xl px-3 py-2 text-sm"
      : "rounded-xl px-4 py-2.5 text-sm";

  const menuWidth = size === "sm" ? "w-48" : "w-56";
  const itemText = size === "sm" ? "text-base" : "text-lg";
  const itemPadding = size === "sm" ? "px-4 py-3" : "px-5 py-3.5";
  const menuPadding = size === "sm" ? "p-2" : "p-3";
  const menuPosition =
    direction === "down"
      ? "top-full mt-2"
      : "bottom-12";

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className={classNames(
          "inline-flex items-center gap-2 rounded-xl bg-[#bfefff] font-semibold text-[#056f9b] hover:bg-[#aeeaff]",
          triggerCls
        )}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {languageLabel[lang]}
        <span className="inline-block translate-y-[1px] text-sky-700">▾</span>
      </button>

      {open ? (
        <div
          role="menu"
          className={classNames(
            "absolute left-1/2 -translate-x-1/2 rounded-3xl bg-white shadow-[0_18px_50px_rgba(0,0,0,0.16)] ring-1 ring-zinc-200",
            menuPosition,
            menuWidth,
            menuPadding
          )}
        >
          {(["pt", "es", "en"] as const).map((opt) => {
            const selected = opt === lang;
            return (
              <button
                key={opt}
                type="button"
                role="menuitem"
                className={classNames(
                  "block w-full rounded-xl text-left font-semibold transition hover:bg-zinc-50",
                  itemText,
                  itemPadding,
                  selected ? "bg-[#e5e7eb] text-zinc-900" : "text-zinc-900"
                )}
                onClick={() => {
                  persistLanguage(opt);
                  onChange(opt);
                  setOpen(false);
                }}
              >
                {languageLabel[opt]}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

