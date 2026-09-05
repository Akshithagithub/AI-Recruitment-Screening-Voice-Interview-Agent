import type { ReactNode } from "react";
import { Card, CardHeader } from "@/src/components/ui/Card";

export function FormSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <Card><CardHeader><h2 className="font-semibold text-slate-950">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></CardHeader><div className="grid gap-5 p-5">{children}</div></Card>;
}