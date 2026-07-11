import type { ReactNode } from "react";
import OSWindow from "../components/OSWindow";

type Props = {
  id: string;
  title: string;
  icon?: string;
  accent?: "blue" | "purple" | "emerald" | "amber" | "indigo" | "rose";
  children: ReactNode;
  defaultOpen?: boolean;
};

export default function GuideSection({
  id,
  title,
  icon = "◈",
  accent = "blue",
  children,
  defaultOpen = true,
}: Props) {
  return (
    <section id={id} className="scroll-mt-6">
      <OSWindow title={title} icon={icon} accent={accent} width="full" defaultOpen={defaultOpen}>
        <div className="guide-prose space-y-4 text-slate-700 text-[15px] leading-relaxed">{children}</div>
      </OSWindow>
    </section>
  );
}

export function GuideH3({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2 first:mt-0">{children}</h3>;
}

export function GuideP({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export function GuideUl({ children }: { children: ReactNode }) {
  return <ul className="list-disc list-outside ml-5 space-y-2">{children}</ul>;
}

export function GuideOl({ children }: { children: ReactNode }) {
  return <ol className="list-decimal list-outside ml-5 space-y-2">{children}</ol>;
}

export function GuideLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <a href={to} className="text-indigo-600 hover:underline font-medium">
      {children}
    </a>
  );
}
