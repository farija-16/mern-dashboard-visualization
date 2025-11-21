import React from "react";

export default function TopBar() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Visualization Dashboard
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Insights from intensity, likelihood, relevance, topics & regions
        </p>
      </div>

      <div className="flex items-center gap-4">
        <input
          placeholder="Search..."
          className="hidden md:block border border-slate-200 rounded-full px-4 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
        <div className="w-9 h-9 rounded-full bg-slate-300" />
      </div>
    </header>
  );
}
