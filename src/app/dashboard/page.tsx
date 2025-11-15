"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <Accordion
        type="single"
        collapsible
        className="w-full flex flex-col gap-4"
      >
        {APPLICATIONS_DATA.map((application) => (
          <ApplicationRow key={application.id} application={application} />
        ))}
      </Accordion>
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
