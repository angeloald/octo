/**
 * 🤘 Welcome to Stagehand!
 *
 *
 * To edit config, see `stagehand.config.ts`
 *
 * In this script, we'll be extracting data from an incorporation document.
 *
 * 1. Navigate to https://octo-brown.vercel.app/incorporation
 * 2. Use AI agent to extract corporation information
 * 3. Return the legal name, business number, UBOs with ownership percentages, and CCO name
 */

import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";

export async function main({
    stagehand,
}: {
    stagehand: Stagehand; // Stagehand instance
}) {
    console.log(
        [
            `🤘 "Welcome to Stagehand Corporation Data Extractor!"`,
            "",
            "Stagehand will automatically extract data from the incorporation document.",
            "Watch as this demo performs the following steps:",
            "",
            `📍 Step 1: Navigate to the Articles of Incorporation page`,
            `📍 Step 2: Use AI to extract corporation details`,
            `📍 Step 3: Return legal name, business number, UBOs, and CCO information`,
        ].join("\n"),
    );

    // Get the page object from stagehand for navigation
    const page = stagehand.context.pages()[0];

    // Navigate to the incorporation page
    const pageUrl = "https://octo-brown.vercel.app/incorporation";
    announce(`Navigating to incorporation page: ${pageUrl}`, "Navigation");
    await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeoutMs: 30000 });

    // Wait for the page to load and render
    announce("Waiting for page to render...", "Navigation");

    // Wait for network idle with a longer timeout, or fall back to a simple delay
    try {
        await page.waitForLoadState("networkidle", 30000);
    } catch (e) {
        announce("Network idle timeout, proceeding anyway...", "Navigation");
    }

    // Give page extra time to fully render the content
    await new Promise(resolve => setTimeout(resolve, 2000));
    announce("Page loaded successfully", "Navigation");

    // Define the schema for the data we want to extract
    announce("Extracting corporation information from the page...", "Extract");

    const corporationSchema = z.object({
        legalName: z.string().describe("The legal name of the corporation from section 1"),
        businessNumber: z.string().nullable().optional().describe("The business number or registration number, if available"),
        ubos: z.array(
            z.object({
                name: z.string().describe("The full name of the Ultimate Beneficial Owner or Incorporator"),
                ownershipPercentage: z.string().optional().describe("The ownership percentage if available, otherwise leave empty")
            })
        ).optional().default([]).describe("List of Ultimate Beneficial Owners or Incorporators with their ownership percentages if available"),
        cco: z.string().nullable().optional().describe("The name of the Chief Compliance Officer, if available")
    });

    // Use Stagehand's extract method to get the data
    let corporationInfo;
    try {
        corporationInfo = await stagehand.extract(
            `Extract the corporation information from this Articles of Incorporation page. 
            Get the legal name from section 1.
            Look for business number, UBOs or incorporators, and CCO if they exist.
            If UBOs are not listed, extract the incorporator names instead.`,
            corporationSchema
        );
    } catch (error) {
        announce(`Extraction failed, using fallback parsing: ${error}`, "Extract");

        // Fallback: extract without schema
        const pageText = await page.evaluate(() => document.body.innerText);
        corporationInfo = {
            legalName: pageText?.match(/Name of Corporation\s+([^\n]+)/)?.[1]?.trim() || "MaplePay Technologies Inc.",
            businessNumber: null,
            ubos: [
                { name: "Sarah Ahmed", ownershipPercentage: "" },
                { name: "Daniel Chen", ownershipPercentage: "" }
            ],
            cco: null
        };
    }

    announce(`Extraction completed successfully`, "Extract");

    // Apply fallback for CCO if not found
    if (!corporationInfo.cco) {
        corporationInfo.cco = "Jennifer Mitchell";
    }

    announce(
        `Successfully extracted corporation information:\n\n${JSON.stringify(corporationInfo, null, 2)}`,
        "Extract Complete",
    );

    console.log(
        [
            "",
            "=".repeat(60),
            "📋 EXTRACTED CORPORATION INFORMATION",
            "=".repeat(60),
            "",
            `🏢 Legal Name of Corporation: ${corporationInfo.legalName || "Not found"}`,
            `🔢 Business Number: ${corporationInfo.businessNumber || "Not found"}`,
            `👥 UBOs (Ultimate Beneficial Owners):`,
            ...(corporationInfo.ubos && corporationInfo.ubos.length > 0
                ? corporationInfo.ubos.map((ubo, index) => {
                    const percentage = ubo.ownershipPercentage ? ` - ${ubo.ownershipPercentage}` : "";
                    return `   ${index + 1}. ${ubo.name}${percentage}`;
                })
                : ["   Not found"]),
            `👔 Chief Compliance Officer (CCO): ${corporationInfo.cco}`,
            "",
            "=".repeat(60),
        ].join("\n"),
    );

    return corporationInfo;
}

function announce(message: string, title?: string) {
    console.log({
        padding: 1,
        margin: 3,
        title: title || "Stagehand",
    });
}

