"use client";

import { use, useEffect, useState } from "react";
import { AppShell } from "@/src/components/layout/AppShell";
import { PageHeader } from "@/src/components/layout/PageHeader";
import { JobForm } from "@/src/components/jobs/JobForm";
import { ApiError } from "@/src/services/api";
import { jobsService } from "@/src/services/jobs";
import type { JobFormValues } from "@/src/types/job";

export default function EditJobPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params);
  const [initialValues, setInitialValues] = useState<JobFormValues | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    jobsService.get(jobId).then((job) => {
      if (active) setInitialValues(job);
    }).catch((reason: unknown) => {
      if (!active) return;
      setError(reason instanceof ApiError && reason.status === 404 ? "Job not found." : reason instanceof Error ? reason.message : "Unable to load this job.");
    });
    return () => { active = false; };
  }, [jobId]);

  return <AppShell><PageHeader title="Edit job" description="Update the role details and recruitment configuration." />{error ? <p className="text-sm text-rose-700" role="alert">{error}</p> : initialValues ? <JobForm initialValues={initialValues} mode="edit" jobId={jobId} /> : <p className="text-sm text-slate-500" role="status">Loading job...</p>}</AppShell>;
}