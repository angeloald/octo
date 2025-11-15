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
        hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
        hasBrowserbaseApiKey: Boolean(process.env.BROWSERBASE_API_KEY),
        hasBrowserbaseProjectId: Boolean(process.env.BROWSERBASE_PROJECT_ID),
    });
}

const DEFAULT_MODEL: AvailableModel = "gpt-4o";
const envFromConfig = (process.env.STAGEHAND_ENV?.toUpperCase() ??
    process.env.NEXT_PUBLIC_STAGEHAND_ENV?.toUpperCase()) as V3Env | undefined;

const env: V3Env =
    envFromConfig ??
    (process.env.BROWSERBASE_API_KEY && process.env.BROWSERBASE_PROJECT_ID
        ? "BROWSERBASE"
        : "LOCAL");

const StagehandConfig: V3Options = {
    env,
    logger: (message: LogLine) =>
        console.log(logLineToString(message)) /* Custom logging function */,
    domSettleTimeout: 30_000 /* Timeout for DOM to settle in milliseconds */,
    localBrowserLaunchOptions: {
        headless: false /* Run browser in headless mode */,
    },
    model: process.env.OPENAI_API_KEY
        ? {
            modelName: DEFAULT_MODEL,
            apiKey: process.env.OPENAI_API_KEY,
        }
        : DEFAULT_MODEL,
};

if (env === "BROWSERBASE") {
    StagehandConfig.apiKey = process.env.BROWSERBASE_API_KEY;
    StagehandConfig.projectId = process.env.BROWSERBASE_PROJECT_ID;
    StagehandConfig.browserbaseSessionCreateParams = {
        projectId: process.env.BROWSERBASE_PROJECT_ID,
    };
}

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

