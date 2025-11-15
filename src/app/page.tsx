"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse" style={{ background: 'rgba(26, 115, 232, 0.15)' }} />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 rounded-full blur-[120px] animate-pulse" style={{ background: 'rgba(0, 198, 167, 0.15)', animationDelay: '1s' }} />
      </div>

      <main className="relative flex min-h-screen w-full max-w-7xl mx-auto flex-col items-center justify-center px-6 py-24 sm:px-12">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-bold mb-4 shadow-lg shadow-primary/20 backdrop-blur-sm">
            <Zap className="size-4 animate-pulse" />
            <span>Powered by AI Automation</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-[#1A73E8] via-[#1A73E8]/80 to-[#00C6A7] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(26,115,232,0.4)]">
              Octo
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground/80 leading-relaxed">
            Streamline government application processing with AI-powered automation.
            Reduce processing time by <span className="text-primary font-bold">89%</span> while maintaining compliance and accuracy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Button asChild size="lg" className="gap-2 text-base shadow-lg shadow-primary/30 bg-primary hover:bg-primary/90">
              <Link href="/dashboard">
                View Dashboard
                <ArrowRight className="size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}