import type { ReactNode } from "react";

type Props = {
  onClick: () => void | Promise<void>;
  children: ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
};

export default function ActionButton({
  onClick,
  children,
  loading,
  variant = "primary",
  disabled,
}: Props) {
  const styles = {
    primary:
      "bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-md shadow-indigo-200/50",
    secondary:
      "bg-white/80 border border-slate-200/80 text-slate-700 hover:bg-white hover:shadow-sm backdrop-blur-sm",
    danger: "bg-gradient-to-b from-rose-500 to-rose-600 text-white shadow-md shadow-rose-200/40",
  };
  return (
    <button
      type="button"
      disabled={loading || disabled}
      onClick={() => void onClick()}
      className={`px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 transition-all active:scale-[0.98] ${styles[variant]}`}
    >
      {loading ? "Working…" : children}
    </button>
  );
}
