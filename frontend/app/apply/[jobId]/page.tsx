"use client";

import { use, useEffect, useState, type FormEvent } from "react";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { FieldLabel, Input, Textarea } from "@/src/components/ui/FormField";
import { ApiError } from "@/src/services/api";
import { applicationsService, type ApplicationFormValues } from "@/src/services/applications";
import { jobsService } from "@/src/services/jobs";
import type { Job } from "@/src/types/job";

type FormErrors = Partial<Record<keyof ApplicationFormValues, string>>;

const MAX_RESUME_SIZE = 5 * 1024 * 1024;
const initialForm: ApplicationFormValues = {
  candidateName: "",
  candidateEmail: "",
  phone: "",
  resume: null,
  coverLetter: "",
};

export default function PublicJobPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<"not-found" | "unavailable" | "network" | null>(null);
  const [form, setForm] = useState<ApplicationFormValues>(initialForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    let active = true;
    jobsService.publicGet(jobId).then((result) => {
      if (active) setJob(result);
    }).catch((reason: unknown) => {
      if (!active) return;
      if (reason instanceof ApiError && reason.status === 404) setError("not-found");
      else if (reason instanceof ApiError && reason.status >= 400 && reason.status < 500) setError("unavailable");
      else setError("network");
    });
    return () => { active = false; };
  }, [jobId]);

  if (error) return <PublicShell><StatePanel title={error === "not-found" ? "Job not found" : error === "unavailable" ? "This job is unavailable" : "Unable to load this job"} description={error === "network" ? "Please check your connection and try again." : "This position may have been unpublished or is no longer accepting applications."} /></PublicShell>;
  if (!job) return <PublicShell><StatePanel title="Loading position" description="Fetching the latest job details..." /></PublicShell>;

  if (job.status !== "published") return <PublicShell><StatePanel title="Applications are closed" description="This position is no longer accepting applications." /></PublicShell>;

  function updateField(field: keyof ApplicationFormValues, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError(null);
  }

  function handleResumeChange(file: File | null) {
    setForm((current) => ({ ...current, resume: file }));
    setFormErrors((current) => ({ ...current, resume: undefined }));
    setSubmitError(null);
  }

  function validate(): FormErrors {
    const errors: FormErrors = {};
    if (!form.candidateName.trim()) errors.candidateName = "Enter your full name.";
    if (!form.candidateEmail.trim()) errors.candidateEmail = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.candidateEmail.trim())) errors.candidateEmail = "Enter a valid email address.";
    if (!form.phone.trim()) errors.phone = "Enter your phone number.";
    if (!form.resume) errors.resume = "Upload your resume as a PDF or DOCX file.";
    else if (!isResumeFile(form.resume)) errors.resume = "Resume must be a PDF or DOCX file.";
    else if (form.resume.size > MAX_RESUME_SIZE) errors.resume = "Resume must be 5 MB or smaller.";
    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await applicationsService.create(jobId, form);
      setIsSubmitted(true);
    } catch (reason: unknown) {
      setSubmitError(reason instanceof Error ? reason.message : "We could not submit your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <PublicShell><main className="mx-auto max-w-5xl px-5 py-10 sm:py-14"><header className="border-b border-slate-200 pb-8"><p className="text-sm font-semibold uppercase tracking-wider text-teal-700">Open position</p><h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{job.title}</h1><div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600"><span>{job.department || "Department not specified"}</span><span>{job.location || "Location not specified"}</span><span>{job.employmentType || "Employment type not specified"}</span><span>{job.experienceLevel || "Experience level not specified"}</span></div></header><div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem]"><div className="space-y-7"><ContentSection title="About the role"><p className="whitespace-pre-wrap">{job.description || "No job description provided."}</p></ContentSection><ContentSection title="Responsibilities"><p className="whitespace-pre-wrap">{job.responsibilities || "No responsibilities provided."}</p></ContentSection><ContentSection title="Requirements"><DetailBlock label="Required skills" items={job.requiredSkills} /><DetailBlock label="Preferred skills" items={job.preferredSkills} /><DetailBlock label="Education" text={job.educationRequirements} /><DetailBlock label="Experience" text={job.experienceRequirements} /></ContentSection></div><Card className="h-fit p-6 sm:p-7"><h2 className="text-xl font-semibold text-slate-950">Application form</h2>{isSubmitted ? <div className="mt-6 rounded-lg border border-teal-200 bg-teal-50 p-5"><h3 className="font-semibold text-teal-950">Application submitted successfully.</h3><p className="mt-2 text-sm leading-6 text-teal-900">Thank you, {form.candidateName}. We have received your application and will review it shortly.</p></div> : <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>{submitError && <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-800" role="alert">{submitError}</div>}<FormInput id="candidate-name" label="Full name" value={form.candidateName} error={formErrors.candidateName} onChange={(value) => updateField("candidateName", value)} required autoComplete="name" /><FormInput id="candidate-email" label="Email" type="email" value={form.candidateEmail} error={formErrors.candidateEmail} onChange={(value) => updateField("candidateEmail", value)} required autoComplete="email" /><FormInput id="phone" label="Phone" type="tel" value={form.phone} error={formErrors.phone} onChange={(value) => updateField("phone", value)} required autoComplete="tel" /><ResumeInput file={form.resume} error={formErrors.resume} onChange={handleResumeChange} /><div><FieldLabel htmlFor="cover-letter" label="Cover letter" hint="Optional" /><Textarea id="cover-letter" value={form.coverLetter} onChange={(event) => updateField("coverLetter", event.target.value)} placeholder="Tell us why you are interested in this role." /></div><Button className="w-full" type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting application..." : "Submit application"}</Button></form>}</Card></div></main></PublicShell>;
}

function PublicShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-50 text-slate-900"><header className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-4xl px-5 py-5"><span className="text-base font-bold tracking-tight text-slate-950">HireVoice<span className="text-teal-700">.</span></span></div></header>{children}</div>;
}

function StatePanel({ title, description }: { title: string; description: string }) {
  return <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-5 py-10"><Card className="w-full p-8 text-center"><h1 className="text-xl font-semibold text-slate-950">{title}</h1><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></Card></main>;
}

function ContentSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="text-xl font-semibold text-slate-950">{title}</h2><div className="mt-3 text-sm leading-7 text-slate-600">{children}</div></section>;
}

function DetailBlock({ label, items, text }: { label: string; items?: string[]; text?: string }) {
  return <div className="mt-5 first:mt-0"><h3 className="text-sm font-semibold text-slate-950">{label}</h3>{items?.length ? <ul className="mt-2 list-disc space-y-1 pl-5">{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-1">{text || "Not specified."}</p>}</div>;
}

function FormInput({ id, label, hint, error, onChange, ...props }: { id: string; label: string; hint?: string; error?: string; onChange: (value: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  return <div><FieldLabel htmlFor={id} label={label} hint={hint} required={props.required} /><Input {...props} id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} onChange={(event) => onChange(event.target.value)} />{error && <p className="mt-1.5 text-sm text-rose-700" id={`${id}-error`}>{error}</p>}</div>;
}

function isResumeFile(file: File) {
  const extension = file.name.toLowerCase().split(".").pop();
  return extension === "pdf" || extension === "docx";
}

function ResumeInput({ file, error, onChange }: { file: File | null; error?: string; onChange: (file: File | null) => void }) {
  return <div><FieldLabel htmlFor="resume" label="Resume" hint="Required" required /><Input id="resume" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" aria-invalid={Boolean(error)} aria-describedby={error ? "resume-error" : "resume-help"} onChange={(event) => onChange(event.target.files?.[0] ?? null)} />{file ? <p className="mt-2 break-all text-sm text-slate-700">Selected: {file.name}</p> : <p className="mt-2 text-xs leading-5 text-slate-500" id="resume-help">Accepted formats: PDF or DOCX. Maximum size: 5 MB.</p>}{error && <p className="mt-1.5 text-sm text-rose-700" id="resume-error">{error}</p>}</div>;
}