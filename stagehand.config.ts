import type {
    AvailableModel,
    LogLine,
    V3Env,
    V3Options,
} from "@browserbasehq/stagehand";
import dotenv from "dotenv";

dotenv.config();

if (process.env.NODE_ENV !== "production") {
    // Avoid printing full secrets; we only confirm presence.
    console.log("[stagehand.config] Env loaded", {
        hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
        hasBrowserbaseApiKey: Boolean(process.env.BROWSERBASE_API_KEY),
        hasBrowserbaseProjectId: Boolean(process.env.BROWSERBASE_PROJECT_ID),
    });
}

const DEFAULT_MODEL: AvailableModel = "google/gemini-2.5-flash";

// Helper to safely get and trim env vars
const getEnv = (key: string): string | undefined => {
    const value = process.env[key];
    return value?.trim() || undefined;
};

// Always use BROWSERBASE if credentials are available, otherwise LOCAL
const browserbaseApiKey = getEnv("BROWSERBASE_API_KEY");
const browserbaseProjectId = getEnv("BROWSERBASE_PROJECT_ID");
const env: V3Env =
    browserbaseApiKey && browserbaseProjectId ? "BROWSERBASE" : "LOCAL";

const StagehandConfig: V3Options = {
    env,
    logger: (message: LogLine) =>
        console.log(logLineToString(message)) /* Custom logging function */,
    domSettleTimeout: 30_000 /* Timeout for DOM to settle in milliseconds */,
    localBrowserLaunchOptions: {
        headless: false /* Run browser in headless mode */,
    },
    model: getEnv("GEMINI_API_KEY")
        ? {
            modelName: DEFAULT_MODEL,
            apiKey: getEnv("GEMINI_API_KEY")!,
        }
        : DEFAULT_MODEL,
    // Always set Browserbase credentials if available
    ...(browserbaseApiKey && browserbaseProjectId
        ? {
            apiKey: browserbaseApiKey,
            projectId: browserbaseProjectId,
            browserbaseSessionCreateParams: {
                projectId: browserbaseProjectId,
            },
        }
        : {}),
};

export default StagehandConfig;

/**
 * Custom logging function that you can use to filter logs.
 *
 * General pattern here is that `message` will always be unique with no params
 * Any param you would put in a log is in `auxiliary`.
 *
 * For example, an error log looks like this:
 *
 * ```
 * {
 *   category: "error",
 *   message: "Some specific error occurred",
 *   auxiliary: {
 *     message: { value: "Error message", type: "string" },
 *     trace: { value: "Error trace", type: "string" }
 *   }
 * }
 * ```
 *
 * You can then use `logLineToString` to filter for a specific log pattern like
 *
 * ```
 * if (logLine.message === "Some specific error occurred") {
 *   console.log(logLineToString(logLine));
 * }
 * ```
 */
export function logLineToString(logLine: LogLine): string {
    // If you want more detail, set this to false. However, this will make the logs
    // more verbose and harder to read.
    const HIDE_AUXILIARY = true;

    try {
        const timestamp = logLine.timestamp || new Date().toISOString();
        if (logLine.auxiliary?.error) {
            return `${timestamp}::[stagehand:${logLine.category}] ${logLine.message}\n ${logLine.auxiliary.error.value}\n ${logLine.auxiliary.trace.value}`;
        }

        // If we want to hide auxiliary information, we don't add it to the log
        return `${timestamp}::[stagehand:${logLine.category}] ${logLine.message} ${logLine.auxiliary && !HIDE_AUXILIARY
            ? JSON.stringify(logLine.auxiliary)
            : ""
            }`;
    } catch (error) {
        console.error(`Error logging line:`, error);
        return "error logging line";
    }
}

