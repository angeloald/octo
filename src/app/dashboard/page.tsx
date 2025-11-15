"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
export default function DashboardPage() {
  const [selectedApplication, setSelectedApplication] = useState<number | null>(
    null
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {APPLICATIONS_DATA.map((application) => (
          <ApplicationRow
            key={application.id}
            application={application}
            onSelect={() => setSelectedApplication(application.id)}
          />
        ))}
      </div>
      <div>
        <Button>Process Applications</Button>
      </div>
    </div>
  );
}

const ApplicationRow = ({
  application,
  onSelect,
}: {
  application: Application;
  onSelect: () => void;
}) => {
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
    <div
      className="grid grid-cols-3 items-center gap-4 p-4 border rounded-md shadow-md hover:shadow-lg transition-shadow"
      onClick={onSelect}
    >
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
  );
};

type Application = {
  id: number;
  name: string;
  description: string;
  urgency: "low" | "medium" | "high";
  createdAt: Date;
};

const APPLICATIONS_DATA: Application[] = [
  {
    id: 1,
    name: "Michael Jackson",
    description: "Citizenship application",
    urgency: "low",
    createdAt: new Date("2025-01-01"),
  },
  {
    id: 2,
    name: "Justin Bieber",
    description: "Visa application",
    urgency: "medium",
    createdAt: new Date("2025-01-02"),
  },
  {
    id: 3,
    name: "Jennifer Lopez",
    description: "Passport application",
    urgency: "high",
    createdAt: new Date("2025-01-03"),
  },
];
