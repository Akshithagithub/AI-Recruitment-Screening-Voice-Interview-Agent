import type { JobStatus } from "@/src/types/job";

const labels: Record<JobStatus, string> = { draft: "Draft", published: "Published", unpublished: "Unpublished" };
const colors: Record<JobStatus, string> = { draft: "bg-slate-100 text-slate-700", published: "bg-emerald-50 text-emerald-700", unpublished: "bg-amber-50 text-amber-700" };

export function StatusBadge({ status }: { status: JobStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colors[status]}`}>{labels[status]}</span>;
}