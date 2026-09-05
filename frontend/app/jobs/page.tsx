"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/src/components/layout/AppShell";
import { PageHeader } from "@/src/components/layout/PageHeader";
import { Button } from "@/src/components/ui/Button";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { StatusBadge } from "@/src/components/ui/StatusBadge";
import { jobsService } from "@/src/services/jobs";
import type { Job } from "@/src/types/job";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { jobsService.list().then(setJobs).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load jobs.")).finally(() => setLoading(false)); }, []);
  async function remove(jobId: number) { if (!window.confirm("Delete this job?")) return; try { await jobsService.remove(jobId); setJobs((current) => current.filter((job) => job.id !== jobId)); } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to delete the job."); } }
  return <AppShell><PageHeader title="Jobs" description="Create and manage the roles in your recruitment workspace." action={<Button href="/jobs/new">Create job</Button>} /><section aria-label="Jobs list">{loading ? <p className="text-sm text-slate-500">Loading jobs...</p> : error ? <p className="text-sm text-rose-700" role="alert">{error}</p> : jobs.length === 0 ? <EmptyState title="No jobs to display" description="Create a job to begin configuring its requirements and interview flow." action={<Button href="/jobs/new">Create job</Button>} /> : <div className="overflow-hidden rounded-xl border border-slate-200 bg-white"><div className="divide-y divide-slate-100">{jobs.map((job) => <article className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between" key={job.id}><div><div className="flex flex-wrap items-center gap-3"><h2 className="font-semibold text-slate-950">{job.title}</h2><StatusBadge status={job.status} /></div><p className="mt-1 text-sm text-slate-500">{[job.department, job.location, job.employmentType, job.experienceLevel].filter(Boolean).join(" · ")} · {job.openings} opening{job.openings === 1 ? "" : "s"}</p><p className="mt-1 text-xs text-slate-400">Created {new Date(job.createdAt).toLocaleDateString()}</p></div><div className="flex gap-2"><Button href={`/jobs/${job.id}`} variant="secondary">View</Button><Button href={`/jobs/${job.id}/edit`} variant="ghost">Edit</Button><Button type="button" variant="ghost" onClick={() => remove(job.id)}>Delete</Button></div></article>)}</div></div>}</section></AppShell>;
}