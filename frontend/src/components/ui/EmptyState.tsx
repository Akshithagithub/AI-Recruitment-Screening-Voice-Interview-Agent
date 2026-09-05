import type { ReactNode } from "react";
import { Card } from "./Card";

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <Card className="flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-xl text-teal-700">+</div>
    <h2 className="text-base font-semibold text-slate-900">{title}</h2>
    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </Card>;
}