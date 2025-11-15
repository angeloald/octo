/**
 * 🤘 Welcome to Stagehand!
 *
 * This is the server-side entry point for Stagehand.
 *
 * To edit the Stagehand script, see `api/stagehand/main.ts`.
 * To edit config, see `stagehand.config.ts`.
 *
 * In this quickstart, we'll be automating a browser session to show you the power of Playwright and Stagehand's AI features.
 */
"use server";

import StagehandConfig from "@/stagehand.config";
import Browserbase from "@browserbasehq/sdk";
import { Stagehand } from "@browserbasehq/stagehand";
import { main } from "./main";

export type StagehandRuntimeConfig = {
    env: "LOCAL" | "BROWSERBASE";
    headless?: boolean;
    domSettleTimeout?: number;
    browserbaseSessionID?: string;
    hasBrowserbaseCredentials: boolean;
    hasLLMCredentials: boolean;
};

export async function runStagehand(sessionId?: string) {
    const stagehand = new Stagehand({
        ...StagehandConfig,
        browserbaseSessionID: sessionId,
    });
    await stagehand.init();
    await main({ stagehand });
    await stagehand.close();
}

export async function startBBSSession() {
    // Read directly from env to ensure we have the latest values, trim whitespace
    let apiKey = process.env.BROWSERBASE_API_KEY?.trim();
    let projectId = process.env.BROWSERBASE_PROJECT_ID?.trim();

    if (!apiKey || !projectId) {
        throw new Error(
            "Missing Browserbase credentials. Set BROWSERBASE_API_KEY and BROWSERBASE_PROJECT_ID."
        );
    }

    if (apiKey.length === 0 || projectId.length === 0) {
        throw new Error(
            "Browserbase credentials are empty. Check your .env file."
        );
    }

    // Detect if credentials might be swapped (API keys typically start with 'bb_' or similar)
    if (projectId.startsWith("bb_") && !apiKey.startsWith("bb_")) {
        console.warn(
            "[startBBSSession] WARNING: Project ID looks like an API key (starts with 'bb_'). " +
            "You may have swapped BROWSERBASE_API_KEY and BROWSERBASE_PROJECT_ID in your .env file."
        );
    }

    // Debug logging (only show first/last chars of API key for security)
    if (process.env.NODE_ENV !== "production") {
        console.log("[startBBSSession] Creating session with:", {
            apiKeyPrefix: apiKey.substring(0, 8) + "...",
            apiKeyLength: apiKey.length,
            apiKeyStartsWith: apiKey.substring(0, 3),
            projectId,
            projectIdStartsWith: projectId.substring(0, 3),
        });
    }

    const browserbase = new Browserbase({
        apiKey: apiKey,
    });

    const sessionCreateParams: any = {
        projectId: projectId,
        browserSettings: {
            enablePdfViewer: true, // Enable PDF viewer for opening PDF documents
        },
    };

    try {
        const session = await browserbase.sessions.create(sessionCreateParams);
        const debugUrl = await browserbase.sessions.debug(session.id);
        return {
            sessionId: session.id,
            debugUrl: debugUrl.debuggerFullscreenUrl,
        };
    } catch (error: any) {
        // Enhanced error logging
        console.error("[startBBSSession] Error creating session:", {
            status: error?.status,
            message: error?.message,
            errorBody: error?.error,
            projectId,
            apiKeyPrefix: apiKey.substring(0, 8) + "...",
            apiKeyLength: apiKey.length,
        });

        // Provide helpful error message
        if (error?.status === 401) {
            throw new Error(
                `Browserbase authentication failed (401). Please verify:\n` +
                `1. Your BROWSERBASE_API_KEY is correct and not expired\n` +
                `2. Your BROWSERBASE_PROJECT_ID matches the project in your Browserbase dashboard\n` +
                `3. The API key has permission to create sessions in this project\n` +
                `4. You haven't swapped the API key and project ID in your .env file`
            );
        }

        throw error;
    }
}

export async function getConfig(): Promise<StagehandRuntimeConfig> {
    const hasBrowserbaseCredentials =
        process.env.BROWSERBASE_API_KEY !== undefined &&
        process.env.BROWSERBASE_PROJECT_ID !== undefined;

    const hasLLMCredentials = process.env.GEMINI_API_KEY !== undefined;

    return {
        env: StagehandConfig.env,
        headless: StagehandConfig.localBrowserLaunchOptions?.headless,
        domSettleTimeout: StagehandConfig.domSettleTimeout,
        browserbaseSessionID: StagehandConfig.browserbaseSessionID,
        hasBrowserbaseCredentials,
        hasLLMCredentials,
    };
}

