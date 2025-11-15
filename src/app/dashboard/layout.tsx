import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full m-auto max-w-screen-xl p-16">
      {children}
    </main>
  );
}
