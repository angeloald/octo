"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <div>
        <Accordion type="single" collapsible className="flex flex-col gap-4">
          {APPLICATIONS_DATA.map((application) => (
            <ApplicationRow key={application.id} application={application} />
          ))}
        </Accordion>
      </div>
      <div>
        <WorkflowInspector steps={WORKFLOW_STEPS} />
      </div>
    </div>
  );
}

const ApplicationRow = ({ application }: { application: Application }) => {
  const getUrgencyColor = (urgency: "low" | "medium" | "high") => {
    switch (urgency) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-orange-500";
      case "low":
        return "bg-green-500";
    }
  };

  return (
    <AccordionItem
      value={application.id.toString()}
      className="border rounded-md shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="grid grid-cols-3 items-center gap-4 p-4">
        <div className="flex flex-col">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
          <p className="text-sm font-medium text-gray-700">
            {application.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-900">
              {application.name}
            </p>
            <p className="text-sm text-gray-500">{application.description}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${getUrgencyColor(
              application.urgency
            )}`}
          ></div>
          <span className="text-xs font-medium text-gray-600 capitalize">
            {application.urgency}
          </span>
        </div>
      </div>
      <AccordionTrigger className="px-4">
        Automatically Process
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <iframe
          src="https://example.com"
          className="w-full h-[400px] border rounded-md"
          title="Example"
        />
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
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Workflow Inspector
      </h2>
      <div className="flex flex-col gap-0">
        {steps.map((step, index) => (
          <div key={step.step} className="flex gap-4 relative">
            {/* Step number circle */}
            <div className="flex flex-col items-center relative">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm shrink-0 z-10">
                {step.step}
              </div>
              {/* Connecting line - only show if not the last step */}
              {index !== steps.length - 1 && (
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-300 h-full" />
              )}
            </div>
            {/* Step content */}
            <div
              className={`flex-1 pt-1 ${
                index < steps.length - 1 ? "pb-6" : ""
              }`}
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-medium text-gray-900">
                  Step {step.step}: {step.name}
                </h3>
                {step.description && (
                  <p className="text-sm text-gray-500">{step.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
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
