"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/Button";
import { FieldLabel, Input, Select, Textarea } from "@/src/components/ui/FormField";
import { FormSection } from "@/src/components/jobs/FormSection";
import { SkillInput } from "@/src/components/jobs/SkillInput";
import { jobsService } from "@/src/services/jobs";
import { employmentTypes, experienceLevels, type JobFormValues } from "@/src/types/job";

const emptyValues: JobFormValues = { title: "", department: "", location: "", employmentType: "", experienceLevel: "", openings: 1, description: "", responsibilities: "", requiredSkills: [], preferredSkills: [], educationRequirements: "", experienceRequirements: "", screening: { minimumScore: 0, shortlistThreshold: 0, manualReviewThreshold: 0, rejectThreshold: 0 }, interview: { durationMinutes: 30, technicalSkills: [], behavioralCriteria: [], difficulty: "", technicalQuestionCount: 0, behavioralQuestionCount: 0, followUpQuestionsEnabled: false } };

export function JobForm({ initialValues = emptyValues, mode, jobId }: { initialValues?: JobFormValues; mode: "create" | "edit"; jobId?: string }) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const update = <K extends keyof JobFormValues>(key: K, value: JobFormValues[K]) => setValues((current) => ({ ...current, [key]: value }));
  const updateScreening = (key: keyof JobFormValues["screening"], value: number) => setValues((current) => ({ ...current, screening: { ...current.screening, [key]: value } }));
  const updateInterview = <K extends keyof JobFormValues["interview"]>(key: K, value: JobFormValues["interview"][K]) => setValues((current) => ({ ...current, interview: { ...current.interview, [key]: value } }));
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setMessage("");
    setSaving(true);
    try {
      if (mode === "create") {
        const createdJob = await jobsService.create(values);
        setMessage("Job created successfully. Redirecting to the dashboard...");
        window.setTimeout(() => router.push(`/dashboard?created=${createdJob.id}`), 500);
      } else {
        if (!jobId) throw new Error("A job ID is required to update this job.");
        await jobsService.update(jobId, values);
        router.push("/jobs");
      }
    } catch (error) {
      setSaving(false);
      setMessage(error instanceof Error ? error.message : mode === "create" ? "Unable to create the job. Please try again." : "Unable to update the job. Please try again.");
    }
  }
  return <form className="space-y-6" onSubmit={submit}>
    <FormSection title="Basic job information" description="Define the role recruiters will share with candidates.">
      <div className="grid gap-5 md:grid-cols-2"><div><FieldLabel label="Job title" htmlFor="title" required /><Input id="title" required value={values.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Senior Product Designer" /></div><div><FieldLabel label="Department" htmlFor="department" /><Input id="department" value={values.department} onChange={(e) => update("department", e.target.value)} placeholder="e.g. Product" /></div><div><FieldLabel label="Location" htmlFor="location" /><Input id="location" value={values.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. New York or Remote" /></div><div><FieldLabel label="Employment type" htmlFor="employmentType" /><Select id="employmentType" value={values.employmentType} onChange={(e) => update("employmentType", e.target.value as JobFormValues["employmentType"])}><option value="">Select type</option>{employmentTypes.map((item) => <option key={item}>{item}</option>)}</Select></div><div><FieldLabel label="Experience level" htmlFor="experienceLevel" /><Select id="experienceLevel" value={values.experienceLevel} onChange={(e) => update("experienceLevel", e.target.value as JobFormValues["experienceLevel"])}><option value="">Select level</option>{experienceLevels.map((item) => <option key={item}>{item}</option>)}</Select></div><div><FieldLabel label="Number of openings" htmlFor="openings" /><Input id="openings" min="1" type="number" value={values.openings} onChange={(e) => update("openings", Number(e.target.value))} /></div></div>
    </FormSection>
    <FormSection title="Job description" description="Give candidates and the screening workflow enough context about the role.">
      <div className="grid gap-5 md:grid-cols-2"><div className="md:col-span-2"><FieldLabel label="Job description" htmlFor="description" /><Textarea id="description" value={values.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe the role and its impact" /></div><div><FieldLabel label="Responsibilities" htmlFor="responsibilities" /><Textarea id="responsibilities" value={values.responsibilities} onChange={(e) => update("responsibilities", e.target.value)} placeholder="List the core responsibilities" /></div><div><FieldLabel label="Education requirements" htmlFor="education" /><Textarea id="education" value={values.educationRequirements} onChange={(e) => update("educationRequirements", e.target.value)} /></div><SkillInput id="requiredSkills" label="Required skills" value={values.requiredSkills} onChange={(value) => update("requiredSkills", value)} /><SkillInput id="preferredSkills" label="Preferred skills" value={values.preferredSkills} onChange={(value) => update("preferredSkills", value)} /><div className="md:col-span-2"><FieldLabel label="Experience requirements" htmlFor="experience" /><Textarea id="experience" value={values.experienceRequirements} onChange={(e) => update("experienceRequirements", e.target.value)} /></div></div>
    </FormSection>
    <FormSection title="Screening configuration" description="Set the thresholds that will guide screening outcomes.">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{([["minimumScore", "Minimum screening score"], ["shortlistThreshold", "Shortlist threshold"], ["manualReviewThreshold", "Manual review threshold"], ["rejectThreshold", "Reject threshold"]] as const).map(([key, label]) => <div key={key}><FieldLabel label={label} htmlFor={key} /><Input id={key} min="0" max="100" type="number" value={values.screening[key]} onChange={(e) => updateScreening(key, Number(e.target.value))} /></div>)}</div>
    </FormSection>
    <FormSection title="Interview configuration" description="Configure the future interview workflow for this role.">
      <div className="grid gap-5 md:grid-cols-2"><div><FieldLabel label="Interview duration (minutes)" htmlFor="duration" /><Input id="duration" min="1" type="number" value={values.interview.durationMinutes} onChange={(e) => updateInterview("durationMinutes", Number(e.target.value))} /></div><div><FieldLabel label="Difficulty" htmlFor="difficulty" /><Select id="difficulty" value={values.interview.difficulty} onChange={(e) => updateInterview("difficulty", e.target.value)}><option value="">Select difficulty</option><option>Easy</option><option>Moderate</option><option>Challenging</option></Select></div><SkillInput id="technicalSkills" label="Technical skills" value={values.interview.technicalSkills} onChange={(value) => updateInterview("technicalSkills", value)} /><SkillInput id="behavioralCriteria" label="Behavioral criteria" value={values.interview.behavioralCriteria} onChange={(value) => updateInterview("behavioralCriteria", value)} /><div><FieldLabel label="Technical questions count" htmlFor="technicalCount" /><Input id="technicalCount" min="0" type="number" value={values.interview.technicalQuestionCount} onChange={(e) => updateInterview("technicalQuestionCount", Number(e.target.value))} /></div><div><FieldLabel label="Behavioral questions count" htmlFor="behavioralCount" /><Input id="behavioralCount" min="0" type="number" value={values.interview.behavioralQuestionCount} onChange={(e) => updateInterview("behavioralQuestionCount", Number(e.target.value))} /></div><label className="flex items-center gap-3 text-sm font-medium text-slate-700 md:col-span-2"><input className="h-4 w-4 accent-teal-700" type="checkbox" checked={values.interview.followUpQuestionsEnabled} onChange={(e) => updateInterview("followUpQuestionsEnabled", e.target.checked)} />Enable follow-up questions</label></div>
    </FormSection>
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center"><Button disabled={saving} type="submit">{saving ? "Saving..." : mode === "create" ? "Save job" : "Save changes"}</Button><Button href="/jobs" variant="ghost">Cancel</Button>{message && <p className={`text-sm ${saving ? "text-teal-700" : "text-rose-700"}`} role={saving ? "status" : "alert"}>{message}</p>}</div>
  </form>;
}