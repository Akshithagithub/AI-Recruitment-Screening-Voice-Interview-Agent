import Link from "next/link";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-slate-50 text-slate-900">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link className="text-base font-bold tracking-tight text-slate-950" href="/dashboard">HireVoice<span className="text-teal-700">.</span></Link>
        <nav aria-label="Main navigation" className="flex items-center gap-1 text-sm font-medium">
          <Link className="rounded-md px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950" href="/dashboard">Dashboard</Link>
          <Link className="rounded-md px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950" href="/jobs">Jobs</Link>
        </nav>
      </div>
    </header>
    <main className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8">{children}</main>
  </div>;
}