"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="w-full space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage and process government applications with AI automation
          </p>
        </div>
        <Button size="lg" className="gap-2">
          <Zap className="size-4" />
          Batch Process All
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          icon={<FileText className="size-5" />}
          label="Total Applications"
          value="24"
          trend="+12%"
          trendUp
        />
        <StatsCard
          icon={<Clock className="size-5" />}
          label="In Progress"
          value="3"
          trend="Active"
          trendUp
        />
        <StatsCard
          icon={<CheckCircle2 className="size-5" />}
          label="Completed Today"
          value="18"
          trend="+5"
          trendUp
        />
        <StatsCard
          icon={<TrendingUp className="size-5" />}
          label="Avg. Process Time"
          value="2.3m"
          trend="-45%"
          trendUp
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Applications List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Pending Applications</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4" />
              <span>{APPLICATIONS_DATA.length} applicants</span>
            </div>
          </div>
          <Accordion type="single" collapsible className="flex flex-col gap-4">
            {APPLICATIONS_DATA.map((application) => (
              <ApplicationRow key={application.id} application={application} />
            ))}
          </Accordion>
        </div>

        {/* Workflow Inspector */}
        <div>
          <WorkflowInspector steps={WORKFLOW_STEPS} />
        </div>
      </div>
    </div>
  );
}

const StatsCard = ({
  icon,
  label,
  value,
  trend,
  trendUp,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-lg shadow-primary/5 transition-all hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground/80">{label}</p>
          <p className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">{value}</p>
          <div className="flex items-center gap-1">
            <span
              className={`text-xs font-medium ${
                trendUp ? "text-green-400" : "text-red-400"
              }`}
            >
              {trend}
            </span>
            <span className="text-xs text-muted-foreground/60">from last week</span>
          </div>
        </div>
        <div className="rounded-full bg-primary/20 p-3 text-primary ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
          {icon}
        </div>
      </div>
    </div>
  );
};

const ApplicationRow = ({ application }: { application: Application }) => {
  const getUrgencyConfig = (urgency: "low" | "medium" | "high") => {
    switch (urgency) {
      case "high":
        return {
          bg: "bg-red-500/10 dark:bg-red-500/20",
          dot: "bg-red-500",
          text: "text-red-700 dark:text-red-400",
          border: "border-red-200 dark:border-red-500/30",
        };
      case "medium":
        return {
          bg: "bg-orange-500/10 dark:bg-orange-500/20",
          dot: "bg-orange-500",
          text: "text-orange-700 dark:text-orange-400",
          border: "border-orange-200 dark:border-orange-500/30",
        };
      case "low":
        return {
          bg: "bg-green-500/10 dark:bg-green-500/20",
          dot: "bg-green-500",
          text: "text-green-700 dark:text-green-400",
          border: "border-green-200 dark:border-green-500/30",
        };
    }
  };

  const urgencyConfig = getUrgencyConfig(application.urgency);

  return (
    <AccordionItem
      value={application.id.toString()}
      className={`border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.01] bg-card/50 backdrop-blur-sm hover:bg-card/80 ${urgencyConfig.border} hover:border-primary/30`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                <Users className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{application.name}</h3>
                <p className="text-sm text-muted-foreground/80">{application.description}</p>
              </div>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${urgencyConfig.bg} border-2 ${urgencyConfig.border}`}>
            <div className={`w-2 h-2 rounded-full ${urgencyConfig.dot} animate-pulse shadow-lg shadow-current`}></div>
            <span className={`text-xs font-bold uppercase tracking-wider ${urgencyConfig.text}`}>
              {application.urgency}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground/70 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary/70" />
            <span>
              {application.createdAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-primary/70" />
            <span>{application.pdfs?.length || 0} documents</span>
          </div>
        </div>

        <AccordionTrigger className="w-full">
          <Button variant="outline" className="w-full gap-2 bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/40 text-primary">
            <Zap className="size-4" />
            Start Automated Processing
          </Button>
        </AccordionTrigger>
      </div>
      
      <AccordionContent className="px-6 pb-6">
        <div className="rounded-lg border border-primary/20 bg-card/30 backdrop-blur-sm p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-foreground">Processing View</h4>
            <Button size="sm" variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/30">Open Full Screen</Button>
          </div>
          <iframe
            src="https://example.com"
            className="w-full h-[400px] border border-primary/20 rounded-lg bg-background/50"
            title="Application Processing"
          />
          <div className="flex gap-2">
            <Button size="sm" variant="default" className="gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30">
              <CheckCircle2 className="size-4" />
              Approve
            </Button>
            <Button size="sm" variant="destructive" className="gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30">
              <AlertCircle className="size-4" />
              Reject
            </Button>
            <Button size="sm" variant="outline" className="border-primary/30 hover:bg-primary/10">
              Request More Info
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

type WorkflowStep = {
  step: number;
  name: string;
  description?: string;
  inputs?: string[];
  outputs?: string[];
};

const WorkflowInspector = ({ steps }: { steps: WorkflowStep[] }) => {
  return (
    <div className="flex flex-col gap-6 sticky top-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Automation Workflow</h2>
          <p className="text-sm text-muted-foreground/70">AI-powered processing steps</p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold ring-2 ring-primary/30">
          {steps.length} Steps
        </div>
      </div>

      <div className="rounded-xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6 shadow-xl shadow-primary/10">
        <div className="flex flex-col gap-0">
          {steps.map((step, index) => (
            <div key={step.step} className="flex gap-4 relative group">
              {/* Step indicator */}
              <div className="flex flex-col items-center relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 text-white flex items-center justify-center font-bold text-sm shrink-0 z-10 shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:shadow-primary/50 transition-all ring-2 ring-primary/30">
                  {step.step}
                </div>
                {/* Connecting line with gradient */}
                {index !== steps.length - 1 && (
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-primary/50 via-primary/30 to-primary/20 h-full" />
                )}
              </div>
              
              {/* Step content */}
              <div
                className={`flex-1 pt-1.5 ${
                  index < steps.length - 1 ? "pb-8" : ""
                }`}
              >
                <div className="flex flex-col gap-2 p-4 rounded-lg bg-card/80 border border-primary/10 hover:border-primary/30 hover:bg-card transition-all group-hover:shadow-lg group-hover:shadow-primary/5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold leading-snug text-foreground">
                      {step.name}
                    </h3>
                    <CheckCircle2 className="size-4 text-green-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                  </div>
                  {step.description && (
                    <p className="text-xs text-muted-foreground/70 leading-relaxed">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="mt-6 pt-6 border-t border-primary/20">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground/70">Automation Progress</span>
            <span className="font-bold text-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">Ready</span>
          </div>
          <div className="w-full h-2 bg-card/50 rounded-full overflow-hidden ring-1 ring-primary/20">
            <div className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary/60 rounded-full w-0 group-hover:w-full transition-all duration-1000 shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
          </div>
        </div>
      </div>
    </div>
  );
};

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: 1,
    name: "Find MSB Registration Form, AML Compliance, Risk Assessment, Ownership & Control",
  },
  {
    step: 2,
    name: "Send FINTRAC forms for FINTRAC",
  },
  {
    step: 3,
    name: "Find Article of Incorporation",
  },
  {
    step: 4,
    name: "Extract corporate identity, directors, and share structure",
  },
  {
    step: 5,
    name: "Store corporate identity, directory, and structure",
  },
];

type Application = {
  id: number;
  name: string;
  description: string;
  urgency: "low" | "medium" | "high";
  createdAt: Date;
  pdfs?: string[];
};

const APPLICATIONS_DATA: Application[] = [
  {
    id: 1,
    name: "Michael Jackson",
    description: "Citizenship application",
    urgency: "low",
    createdAt: new Date("2025-01-01"),
    pdfs: [
      "/pdfs/person/maplepay_aml_compliance_program.pdf",
      "/pdfs/person/maplepay_articles_of_incorporation.pdf",
      "/pdfs/person/maplepay_msb_registration_form.pdf",
      "/pdfs/person/maplepay_nuans_report.pdf",
      "/pdfs/person/maplepay_ownership_and_control_declaration.pdf",
      "/pdfs/person/maplepay_proof_of_identity_sarah_ahmed.pdf",
      "/pdfs/person/maplepay_risk_assessment_summary.pdf",
    ],
  },
  {
    id: 2,
    name: "Justin Bieber",
    description: "Visa application",
    urgency: "medium",
    createdAt: new Date("2025-01-02"),
    pdfs: [
      "/pdfs/person/maplepay_aml_compliance_program.pdf",
      "/pdfs/person/maplepay_articles_of_incorporation.pdf",
      "/pdfs/person/maplepay_msb_registration_form.pdf",
      "/pdfs/person/maplepay_nuans_report.pdf",
      "/pdfs/person/maplepay_ownership_and_control_declaration.pdf",
      "/pdfs/person/maplepay_proof_of_identity_sarah_ahmed.pdf",
      "/pdfs/person/maplepay_risk_assessment_summary.pdf",
    ],
  },
  {
    id: 3,
    name: "Jennifer Lopez",
    description: "Passport application",
    urgency: "high",
    createdAt: new Date("2025-01-03"),
    pdfs: [
      "/pdfs/person/maplepay_aml_compliance_program.pdf",
      "/pdfs/person/maplepay_articles_of_incorporation.pdf",
      "/pdfs/person/maplepay_msb_registration_form.pdf",
      "/pdfs/person/maplepay_nuans_report.pdf",
      "/pdfs/person/maplepay_ownership_and_control_declaration.pdf",
      "/pdfs/person/maplepay_proof_of_identity_sarah_ahmed.pdf",
      "/pdfs/person/maplepay_risk_assessment_summary.pdf",
    ],
  },
];
