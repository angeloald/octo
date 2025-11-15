import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <main className="flex min-h-screen w-full max-w-7xl mx-auto flex-col items-center justify-center px-6 py-24 sm:px-12">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Zap className="size-4" />
            <span>Powered by AI Automation</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Government Process
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Automation
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            Streamline government application processing with AI-powered automation.
            Reduce processing time by 89% while maintaining compliance and accuracy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Button asChild size="lg" className="gap-2 text-base">
              <Link href="/dashboard">
                View Dashboard
                <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 text-base">
              <Link href="/dashboard">
                Learn More
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-16">
          <FeatureCard
            icon={<Zap className="size-6" />}
            title="Lightning Fast"
            description="Process applications in minutes instead of hours with intelligent automation"
          />
          <FeatureCard
            icon={<Shield className="size-6" />}
            title="Secure & Compliant"
            description="Bank-grade security with full audit trails for regulatory compliance"
          />
          <FeatureCard
            icon={<TrendingUp className="size-6" />}
            title="89% Time Saved"
            description="Reduce manual review time from 28 minutes to just 3.2 minutes"
          />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl mt-24">
          <StatCard value="24" label="Applications Today" />
          <StatCard value="3.2m" label="Avg. Process Time" />
          <StatCard value="100%" label="Accuracy Rate" />
          <StatCard value="89%" label="Time Reduction" />
        </div>
      </main>
    </div>
  );
}

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative space-y-3">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

const StatCard = ({ value, label }: { value: string; label: string }) => {
  return (
    <div className="text-center space-y-2">
      <p className="text-4xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
        {value}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};
