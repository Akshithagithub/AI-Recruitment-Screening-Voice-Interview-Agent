export const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
] as const;

export const experienceLevels = [
  "Entry level",
  "Mid level",
  "Senior level",
  "Lead",
] as const;

export const jobStatuses = ["draft", "published", "unpublished"] as const;

export type EmploymentType = (typeof employmentTypes)[number];
export type ExperienceLevel = (typeof experienceLevels)[number];
export type JobStatus = (typeof jobStatuses)[number];

export type ScreeningConfiguration = {
  minimumScore: number;
  shortlistThreshold: number;
  manualReviewThreshold: number;
  rejectThreshold: number;
};

export type InterviewConfiguration = {
  durationMinutes: number;
  technicalSkills: string[];
  behavioralCriteria: string[];
  difficulty: string;
  technicalQuestionCount: number;
  behavioralQuestionCount: number;
  followUpQuestionsEnabled: boolean;
};

export type JobFormValues = {
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType | "";
  experienceLevel: ExperienceLevel | "";
  openings: number;
  description: string;
  responsibilities: string;
  requiredSkills: string[];
  preferredSkills: string[];
  educationRequirements: string;
  experienceRequirements: string;
  screening: ScreeningConfiguration;
  interview: InterviewConfiguration;
};

export type Job = JobFormValues & {
  id: number;
  status: JobStatus;
  publicApplicationUrl?: string;
  createdAt: string;
  updatedAt: string;
};