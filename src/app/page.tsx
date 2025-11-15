import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
"use client";

import {
  getConfig,
  runStagehand,
  startBBSSession,
  type StagehandRuntimeConfig,
} from "@/app/api/stagehand/run";
import DebuggerIframe from "@/components/stagehand/debuggerIframe";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [config, setConfig] = useState<StagehandRuntimeConfig | null>(null);
  const [running, setRunning] = useState(false);
  const [debugUrl, setDebugUrl] = useState<string | undefined>(undefined);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    const config = await getConfig();
    setConfig(config);
    const warningToShow: string[] = [];
    if (!config.hasLLMCredentials) {
      warningToShow.push(
        "No LLM credentials found. Edit stagehand.config.ts to configure your LLM client."
      );
    }
    if (config.env === "BROWSERBASE" && !config.hasBrowserbaseCredentials) {
      warningToShow.push(
        "No BROWSERBASE_API_KEY or BROWSERBASE_PROJECT_ID found. You will probably want this to run Stagehand in the cloud."
      );
    }
    setWarning(warningToShow.join("\n"));
  }, []);

  const startScript = useCallback(async () => {
    if (!config) return;

    setRunning(true);

    try {
      if (config.env === "BROWSERBASE") {
        const { sessionId, debugUrl } = await startBBSSession();
        setDebugUrl(debugUrl);
        setSessionId(sessionId);
        await runStagehand(sessionId);
      } else {
        await runStagehand();
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setRunning(false);
    }
  }, [config]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  if (config === null) {
    return <div>Loading...</div>;
  }

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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:block hidden"
          src="/logo_dark.svg"
          alt="Stagehand logo"
          width={180}
          height={38}
          priority
        />
        <Image
          className="block dark:hidden"
          src="/logo_light.svg"
          alt="Stagehand logo"
          width={180}
          height={38}
          priority
        />
        {running && <DebuggerIframe debugUrl={debugUrl} env={config.env} />}
        <ul className="list-inside text-xl text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 font-semibold">
              api/stagehand/main.ts
            </code>
            .
          </li>
        </ul>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {!running && (
            <a
              href="#"
              className=" border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 hover:bg-yellow-500"
              onClick={startScript}
            >
              🤘 Run Stagehand
            </a>
          )}
          {sessionId && (
            <a
              href={`https://www.browserbase.com/sessions/${sessionId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-solid transition-colors flex items-center justify-center bg-[#F9F6F4] text-black gap-2 hover:border-[#F7F7F7] hover:text-black text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 group "
            >
              <div className="relative w-4 h-4">
                <Image
                  src="/browserbase_grayscale.svg"
                  alt="Browserbase"
                  width={16}
                  height={16}
                  className="absolute opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <Image
                  src="/browserbase.svg"
                  alt="Browserbase"
                  width={16}
                  height={16}
                  className="absolute group-hover:opacity-0 transition-opacity"
                />
              </div>
              View Session on Browserbase
            </a>
          )}
          <a
            className="border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://docs.stagehand.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
        {error && (
          <div className="bg-red-400 text-white rounded-md p-2 max-w-lg">
            Error: {error}
          </div>
        )}
        {warning && (
          <div className="bg-yellow-400 text-black rounded-md p-2 max-w-lg">
            <strong>Warning:</strong> {warning}
          </div>
        )}
      </main>
    </div>
  );
}