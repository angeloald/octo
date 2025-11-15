import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <main className="relative flex min-h-screen w-full max-w-7xl mx-auto flex-col items-center justify-center px-6 py-24 sm:px-12">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-bold mb-4 shadow-lg shadow-primary/20 backdrop-blur-sm">
            <Zap className="size-4 animate-pulse" />
            <span>Powered by AI Automation</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Government Process
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              Automation
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
            <Button asChild size="lg" variant="outline" className="gap-2 text-base border-primary/30 hover:bg-primary/10 hover:border-primary/50">
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
    <div className="group relative overflow-hidden rounded-xl border border-primary/20 bg-card/50 backdrop-blur-sm p-6 shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative space-y-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform ring-2 ring-primary/30 shadow-lg shadow-primary/20">
          {icon}
        </div>
        <h3 className="font-bold text-lg text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

const StatCard = ({ value, label }: { value: string; label: string }) => {
  return (
    <div className="text-center space-y-2 p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all hover:scale-105">
      <p className="text-4xl font-bold bg-gradient-to-br from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(99,102,241,0.3)]">
        {value}
      </p>
      <p className="text-sm text-muted-foreground/70 font-medium">{label}</p>
    </div>
  );
};
