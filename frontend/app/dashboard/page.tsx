"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/src/components/layout/AppShell";
import { PageHeader } from "@/src/components/layout/PageHeader";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { StatusBadge } from "@/src/components/ui/StatusBadge";
import { jobsService } from "@/src/services/jobs";
import type { Job } from "@/src/types/job";

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { jobsService.list().then(setJobs).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load dashboard data.")); }, []);
  const publishedCount = jobs.filter((job) => job.status === "published").length;
  return <AppShell><PageHeader title="Recruiter dashboard" description="A focused view of your recruiting activity and open roles." action={<Button href="/jobs/new">Create job</Button>} />
    {error && <p className="mb-6 text-sm text-rose-700" role="alert">{error}</p>}<section aria-labelledby="overview-title"><h2 id="overview-title" className="mb-4 text-lg font-semibold text-slate-950">Recruitment overview</h2><div className="grid gap-4 sm:grid-cols-3"><Card className="p-6"><p className="text-sm text-slate-500">Total jobs</p><p className="mt-2 text-3xl font-bold text-slate-950">{jobs.length}</p></Card><Card className="p-6"><p className="text-sm text-slate-500">Published jobs</p><p className="mt-2 text-3xl font-bold text-slate-950">{publishedCount}</p></Card><Card className="p-6"><p className="text-sm text-slate-500">Openings</p><p className="mt-2 text-3xl font-bold text-slate-950">{jobs.reduce((total, job) => total + job.openings, 0)}</p></Card></div></section>
    <section aria-labelledby="jobs-title" className="mt-8"><div className="mb-4 flex items-center justify-between"><h2 id="jobs-title" className="text-lg font-semibold text-slate-950">Jobs overview</h2><Button href="/jobs" variant="ghost">View all jobs</Button></div>{jobs.length === 0 ? <EmptyState title="No jobs yet" description="Create your first job to start building a recruitment pipeline." action={<Button href="/jobs/new">Create your first job</Button>} /> : <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">{jobs.slice(0, 5).map((job) => <div className="flex items-center justify-between gap-4 p-5" key={job.id}><div><h3 className="font-semibold text-slate-950">{job.title}</h3><p className="mt-1 text-sm text-slate-500">{job.department || "No department"} · {job.openings} opening{job.openings === 1 ? "" : "s"}</p></div><StatusBadge status={job.status} /></div>)}</div>}</section>
  </AppShell>;
}