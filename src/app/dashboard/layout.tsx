import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <main className="flex min-h-screen w-full m-auto max-w-screen-2xl p-8 md:p-12 lg:p-16">
        {children}
      </main>
    </div>
  );
}
