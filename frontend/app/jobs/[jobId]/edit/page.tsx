"use client";

import { use, useEffect, useState } from "react";
import { AppShell } from "@/src/components/layout/AppShell";
import { PageHeader } from "@/src/components/layout/PageHeader";
import { JobForm } from "@/src/components/jobs/JobForm";
import { jobsService } from "@/src/services/jobs";
import type { JobFormValues } from "@/src/types/job";

export default function EditJobPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params);
  const [values, setValues] = useState<JobFormValues | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { jobsService.get(jobId).then((job) => setValues(job)).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load this job.")); }, [jobId]);
  return <AppShell><PageHeader title="Edit job" description="Update the role details and recruitment configuration." />{error ? <p className="text-sm text-rose-700" role="alert">{error}</p> : values ? <JobForm initialValues={values} mode="edit" jobId={jobId} /> : <p className="text-sm text-slate-500">Loading job...</p>}</AppShell>;
}