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
    const page = await stagehand.context.awaitActivePage();
    await main({ page, stagehand });
    await stagehand.close();
}

export async function startBBSSession() {
    if (StagehandConfig.env !== "BROWSERBASE") {
        throw new Error(
            "Browserbase session requested, but Stagehand is configured for LOCAL mode."
        );
    }

    if (!StagehandConfig.apiKey || !StagehandConfig.projectId) {
        throw new Error(
            "Missing Browserbase credentials. Set BROWSERBASE_API_KEY and BROWSERBASE_PROJECT_ID."
        );
    }

    const browserbase = new Browserbase({
        apiKey: StagehandConfig.apiKey,
    });
    const sessionCreateParams = {
        ...(StagehandConfig.browserbaseSessionCreateParams ?? {}),
        projectId:
            StagehandConfig.browserbaseSessionCreateParams?.projectId ??
            StagehandConfig.projectId,
    };

    const session = await browserbase.sessions.create(sessionCreateParams);
    const debugUrl = await browserbase.sessions.debug(session.id);
    return {
        sessionId: session.id,
        debugUrl: debugUrl.debuggerFullscreenUrl,
    };
}

export async function getConfig(): Promise<StagehandRuntimeConfig> {
    const hasBrowserbaseCredentials =
        process.env.BROWSERBASE_API_KEY !== undefined &&
        process.env.BROWSERBASE_PROJECT_ID !== undefined;

    const hasLLMCredentials = process.env.OPENAI_API_KEY !== undefined;

    return {
        env: StagehandConfig.env,
        headless: StagehandConfig.localBrowserLaunchOptions?.headless,
        domSettleTimeout: StagehandConfig.domSettleTimeout,
        browserbaseSessionID: StagehandConfig.browserbaseSessionID,
        hasBrowserbaseCredentials,
        hasLLMCredentials,
    };
}

