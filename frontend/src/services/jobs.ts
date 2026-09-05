import { apiRequest } from "@/src/services/api";
import type { Job, JobFormValues } from "@/src/types/job";

type ApiJob = {
  id: number;
  title: string;
  department: string | null;
  location: string | null;
  employment_type: JobFormValues["employmentType"];
  experience_level: JobFormValues["experienceLevel"];
  openings: number;
  description: string | null;
  responsibilities: string | null;
  required_skills: string[];
  preferred_skills: string[];
  education_requirements: string | null;
  experience_requirements: string | null;
  screening_config: JobFormValues["screening"];
  interview_config: JobFormValues["interview"];
  status: Job["status"];
  public_application_url: string | null;
  created_at: string;
  updated_at: string;
};

function fromApi(job: ApiJob): Job {
  return {
    id: job.id,
    title: job.title,
    department: job.department ?? "",
    location: job.location ?? "",
    employmentType: job.employment_type ?? "",
    experienceLevel: job.experience_level ?? "",
    openings: job.openings,
    description: job.description ?? "",
    responsibilities: job.responsibilities ?? "",
    requiredSkills: job.required_skills,
    preferredSkills: job.preferred_skills,
    educationRequirements: job.education_requirements ?? "",
    experienceRequirements: job.experience_requirements ?? "",
    screening: job.screening_config,
    interview: job.interview_config,
    status: job.status,
    publicApplicationUrl: job.public_application_url ?? undefined,
    createdAt: job.created_at,
    updatedAt: job.updated_at,
  };
}

function toApi(values: JobFormValues) {
  return {
    title: values.title,
    department: values.department || null,
    location: values.location || null,
    employment_type: values.employmentType || null,
    experience_level: values.experienceLevel || null,
    openings: values.openings,
    description: values.description || null,
    responsibilities: values.responsibilities || null,
    required_skills: values.requiredSkills,
    preferred_skills: values.preferredSkills,
    education_requirements: values.educationRequirements || null,
    experience_requirements: values.experienceRequirements || null,
    screening_config: values.screening,
    interview_config: values.interview,
  };
}

/**
 * Job API operations are centralized here so pages only handle presentation.
 */
export type JobsService = {
  list: () => Promise<Job[]>;
  get: (jobId: string) => Promise<Job>;
  create: (values: JobFormValues) => Promise<Job>;
  update: (jobId: string, values: JobFormValues) => Promise<Job>;
  remove: (jobId: number) => Promise<void>;
  publish: (jobId: number) => Promise<Job>;
};

export const jobsService: JobsService = {
  list: async () => (await apiRequest<ApiJob[]>("/jobs")).map(fromApi),
  get: async (jobId) => fromApi(await apiRequest<ApiJob>(`/jobs/${jobId}`)),
  create: async (values) => fromApi(await apiRequest<ApiJob>("/jobs", { method: "POST", body: JSON.stringify(toApi(values)) })),
  update: async (jobId, values) => fromApi(await apiRequest<ApiJob>(`/jobs/${jobId}`, { method: "PUT", body: JSON.stringify(toApi(values)) })),
  remove: async (jobId) => { await apiRequest(`/jobs/${jobId}`, { method: "DELETE" }); },
  publish: async (jobId) => fromApi(await apiRequest<ApiJob>(`/jobs/${jobId}/publish`, { method: "PATCH" })),
};