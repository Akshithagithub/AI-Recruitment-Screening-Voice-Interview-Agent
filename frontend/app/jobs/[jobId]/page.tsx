import { AppShell } from "@/src/components/layout/AppShell";
import { PageHeader } from "@/src/components/layout/PageHeader";
import { Button } from "@/src/components/ui/Button";
import { Card, CardHeader } from "@/src/components/ui/Card";

export default async function JobDetailPage({ params }: { params: Promise<{ jobId: string }> }) {
  await params;
  return <AppShell><PageHeader title="Job details" description="Review the role, requirements, and interview configuration." action={<Button href="./edit">Edit job</Button>} /><div className="grid gap-6 md:grid-cols-2"><Card><CardHeader><h2 className="font-semibold">Job information</h2></CardHeader><div className="p-5 text-sm text-slate-500">Job information will appear when this page is connected to the backend.</div></Card><Card><CardHeader><h2 className="font-semibold">Current status</h2></CardHeader><div className="p-5 text-sm text-slate-500">Publishing controls will be enabled when job status data is available.</div></Card><Card><CardHeader><h2 className="font-semibold">Requirements</h2></CardHeader><div className="p-5 text-sm text-slate-500">Requirements will appear here.</div></Card><Card><CardHeader><h2 className="font-semibold">Screening and interview</h2></CardHeader><div className="p-5 text-sm text-slate-500">Configuration will appear here.</div></Card><Card className="md:col-span-2"><CardHeader><h2 className="font-semibold">Public application URL</h2></CardHeader><div className="p-5 text-sm text-slate-500">A public application URL will be displayed after the backend provides one.</div></Card></div></AppShell>;
}