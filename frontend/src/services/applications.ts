import { apiRequest } from "@/src/services/api";

export type ApplicationFormValues = {
  candidateName: string;
  candidateEmail: string;
  phone: string;
  resume: File | null;
  coverLetter: string;
};

type ApplicationResponse = {
  id: number;
  status: string;
};

export const applicationsService = {
  create: (jobId: string, values: ApplicationFormValues) => {
    const numericJobId = Number(jobId);
    const body = new FormData();
    body.append("job_id", String(numericJobId));
    body.append("candidate_name", values.candidateName.trim());
    body.append("candidate_email", values.candidateEmail.trim());
    body.append("phone", values.phone.trim());
    body.append("resume", values.resume as File);
    body.append("cover_letter", values.coverLetter.trim());

    return apiRequest<ApplicationResponse>("/applications", {
      method: "POST",
      body,
    });
  },
};