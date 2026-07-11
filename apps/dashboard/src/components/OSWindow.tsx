import { useState, type ReactNode } from "react";

type Props = {
  title: string;
  icon?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  width?: "sm" | "md" | "lg" | "full";
  accent?: "blue" | "purple" | "emerald" | "amber" | "indigo" | "rose";
};

const WIDTH = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl", full: "max-w-full" };

const ACCENT_STRIPE = {
  blue: "border-l-indigo-400 bg-gradient-to-r from-indigo-50/90 to-white",
  purple: "border-l-violet-400 bg-gradient-to-r from-violet-50/90 to-white",
  emerald: "border-l-emerald-400 bg-gradient-to-r from-emerald-50/90 to-white",
  amber: "border-l-amber-400 bg-gradient-to-r from-amber-50/90 to-white",
  indigo: "border-l-indigo-500 bg-gradient-to-r from-indigo-50/90 to-white",
  rose: "border-l-rose-400 bg-gradient-to-r from-rose-50/90 to-white",
};

export default function OSWindow({
  title,
  icon = "◈",
  children,
  defaultOpen = true,
  className = "",
  width = "lg",
  accent = "blue",
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [minimized, setMinimized] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 text-slate-700 text-sm shadow-lg hover:shadow-xl transition"
      >
        {icon} {title}
      </button>
    );
  }

  return (
    <div
      className={`os-window flex flex-col rounded-2xl overflow-hidden ${WIDTH[width]} w-full ${className}`}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 border-l-[3px] border-b border-slate-100/80 select-none ${ACCENT_STRIPE[accent]}`}
      >
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="w-3 h-3 rounded-full bg-[#ff5f57] hover:opacity-80 transition"
          />
          <button
            type="button"
            aria-label="Minimize"
            onClick={() => setMinimized((m) => !m)}
            className="w-3 h-3 rounded-full bg-[#febc2e] hover:opacity-80 transition"
          />
          <span className="w-3 h-3 rounded-full bg-[#28c840] opacity-90" />
        </div>
        <span className="text-sm font-medium text-slate-700 truncate flex-1 tracking-tight">
          <span className="opacity-70 mr-1.5">{icon}</span>
          {title}
        </span>
      </div>
      {!minimized && (
        <div className="flex-1 overflow-auto p-5 text-slate-700 leading-relaxed">{children}</div>
      )}
      {minimized && (
        <div className="px-5 py-2.5 text-xs text-slate-400 border-t border-slate-100">Minimized</div>
      )}
    </div>
  );
}
