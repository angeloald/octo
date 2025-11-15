import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between p-16">
      {children}
    </main>
  );
}
