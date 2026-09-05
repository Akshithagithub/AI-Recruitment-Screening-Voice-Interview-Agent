import { AppShell } from "@/src/components/layout/AppShell";
import { PageHeader } from "@/src/components/layout/PageHeader";
import { JobForm } from "@/src/components/jobs/JobForm";

export default function NewJobPage() {
  return <AppShell><PageHeader title="Create a job" description="Add the role details and configure how candidates will be screened and interviewed." /><JobForm mode="create" /></AppShell>;
}