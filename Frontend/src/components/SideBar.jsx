import React from "react";

export default function SideBar() {
  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 shadow-sm px-4 py-5 flex flex-col">
      {/* Logo / brand */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500" />
          <span className="text-lg font-bold tracking-tight">InsightX</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Data Intelligence Dashboard
        </p>
      </div>

      {/* Main nav */}
      <nav className="space-y-1 text-sm font-medium">
        <SidebarItem label="Dashboard" active />
        <SidebarItem label="Analytics" />
        <SidebarItem label="Reports" />
        <SidebarItem label="Knowledge" />
        <SidebarItem label="Settings" />
      </nav>

      <div className="mt-auto pt-6 text-[11px] text-slate-400">
        © {new Date().getFullYear()} 
      </div>
    </aside>
  );
}

function SidebarItem({ label, active }) {
  return (
    <button
      className={[
        "w-full text-left px-3 py-2 rounded-lg transition",
        active
          ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
          : "text-slate-600 hover:bg-slate-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
