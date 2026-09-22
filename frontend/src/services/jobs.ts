import { apiRequest } from "@/src/services/api";
import type { Job, JobFormValues } from "@/src/types/job";

type ApiJob = {
  id: string | number;
  title: string;
  department?: string | null;
  location?: string | null;
  employment_type?: JobFormValues["employmentType"] | null;
  experience_level?: JobFormValues["experienceLevel"] | null;
  openings?: number;
  description?: string | null;
  responsibilities?: string | null;
  required_skills?: string[];
  preferred_skills?: string[];
  education_requirements?: string | null;
  experience_requirements?: string | null;
  screening_config?: JobFormValues["screening"];
  interview_config?: JobFormValues["interview"];
  status?: Job["status"];
  public_application_url?: string | null;
};

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

function mapApiJob(job: ApiJob): Job {
  return {
    id: String(job.id),
    title: job.title,
    department: job.department ?? "",
    location: job.location ?? "",
    employmentType: job.employment_type ?? "",
    experienceLevel: job.experience_level ?? "",
    openings: job.openings ?? 1,
    description: job.description ?? "",
    responsibilities: job.responsibilities ?? "",
    requiredSkills: job.required_skills ?? [],
    preferredSkills: job.preferred_skills ?? [],
    educationRequirements: job.education_requirements ?? "",
    experienceRequirements: job.experience_requirements ?? "",
    screening: job.screening_config ?? { minimumScore: 0, shortlistThreshold: 80, manualReviewThreshold: 60, rejectThreshold: 0 },
    interview: job.interview_config ?? { durationMinutes: 30, technicalSkills: [], behavioralCriteria: [], difficulty: "", technicalQuestionCount: 0, behavioralQuestionCount: 0, followUpQuestionsEnabled: false },
    status: job.status ?? "published",
    publicApplicationUrl: job.public_application_url ?? undefined,
  };
}

/**
 * Job API operations belong here so pages do not make raw requests.
 */
export type JobsService = {
  list: () => Promise<Job[]>;
  publish: (jobId: string) => Promise<Job>;
  get: (jobId: string) => Promise<Job>;
  publicGet: (jobId: string) => Promise<Job>;
  create: (values: JobFormValues) => Promise<Job>;
  update: (jobId: string, values: JobFormValues) => Promise<Job>;
};

export const jobsService: JobsService = {
  list: async () => (await apiRequest<ApiJob[]>("/jobs")).map(mapApiJob),
  publish: async (jobId) => mapApiJob(await apiRequest<ApiJob>(`/jobs/${encodeURIComponent(jobId)}/publish`, { method: "PATCH" })),
  get: async (jobId) => mapApiJob(await apiRequest<ApiJob>(`/jobs/${encodeURIComponent(jobId)}`)),
  publicGet: async (jobId) => mapApiJob(await apiRequest<ApiJob>(`/jobs/${encodeURIComponent(jobId)}/public`)),
  create: async (values) => mapApiJob(await apiRequest<ApiJob>("/jobs", { method: "POST", body: JSON.stringify(toApi(values)) })),
  update: async (jobId, values) => mapApiJob(await apiRequest<ApiJob>(`/jobs/${encodeURIComponent(jobId)}`, { method: "PUT", body: JSON.stringify(toApi(values)) })),
};