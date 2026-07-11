import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

type Props = {
  content: string;
};

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-slate-900 mt-8 mb-4 first:mt-0 border-b border-slate-200 pb-2">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3 scroll-mt-6">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-2">{children}</h3>
  ),
  p: ({ children }) => <p className="text-slate-700 leading-relaxed mb-4">{children}</p>,
  ul: ({ children }) => <ul className="list-disc list-outside ml-6 mb-4 space-y-1 text-slate-700">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-outside ml-6 mb-4 space-y-1 text-slate-700">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => {
    let to = href ?? "";
    if (to.includes("QUANTUM_RESEARCH")) to = "/readme/quantum-research";
    else if (to.includes("DEV_GUIDE")) to = "/readme/dev-guide";
    else if (to.endsWith("README.md")) to = "/readme";

    if (to.startsWith("/")) {
      return (
        <Link to={to} className="text-indigo-600 hover:underline font-medium">
          {children}
        </Link>
      );
    }
    if (to.startsWith("#")) {
      return (
        <a href={to} className="text-indigo-600 hover:underline">
          {children}
        </a>
      );
    }
    return (
      <a href={href} className="text-indigo-600 hover:underline" target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  },
  code: ({ className, children, ...props }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code
          className={`block text-xs font-mono bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto my-4 ${className ?? ""}`}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className="text-sm font-mono bg-slate-100 text-indigo-800 px-1.5 py-0.5 rounded" {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="my-4">{children}</pre>,
  table: ({ children }) => (
    <div className="overflow-x-auto my-4 rounded-xl border border-slate-200">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-slate-50 border-b border-slate-200">{children}</thead>,
  th: ({ children }) => (
    <th className="text-left px-4 py-2 font-semibold text-slate-800">{children}</th>
  ),
  td: ({ children }) => <td className="px-4 py-2 text-slate-700 border-t border-slate-100">{children}</td>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-indigo-300 bg-indigo-50/50 pl-4 py-2 my-4 text-slate-700 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-slate-200" />,
  strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
};

export default function MarkdownDoc({ content }: Props) {
  return (
    <article className="markdown-doc max-w-3xl">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
