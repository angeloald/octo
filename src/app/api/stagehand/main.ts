/**
 * 🤘 Welcome to Stagehand!
 *
 *
 * To edit config, see `stagehand.config.ts`
 *
 * In this script, we'll be extracting data from a PDF document.
 *
 * 1. Navigate to the PDF at https://octo-brown.vercel.app/pdfs/person/maplepay_articles_of_incorporation.pdf
 * 2. Use `extract` to read and extract corporation information from the PDF
 * 3. Return the corporation name, province, and both incorporator names
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
            `🤘 "Welcome to Stagehand PDF Extractor!"`,
            "",
            "Stagehand will automatically extract data from a PDF document.",
            "Watch as this demo performs the following steps:",
            "",
            `📍 Step 1: Navigate to the Articles of Incorporation PDF`,
            `📍 Step 2: Use AI to extract corporation details from the PDF`,
            `📍 Step 3: Return structured data including corporation name, province, and incorporators`,
        ].join("\n"),
    );

    // Get the page object from stagehand for navigation
    const page = stagehand.context.pages()[0];

    // Navigate to the PDF
    const pdfUrl = "https://octo-brown.vercel.app/pdfs/person/maplepay_articles_of_incorporation.pdf";
    announce(`Navigating to PDF: ${pdfUrl}`, "Navigation");
    await page.goto(pdfUrl, { waitUntil: "domcontentloaded" });

    // Wait for the PDF to load and render
    announce("Waiting for PDF to render...", "Navigation");
    await page.waitForLoadState("networkidle");

    // Give PDF viewer extra time to fully render the content
    await new Promise(resolve => setTimeout(resolve, 3000));
    announce("PDF loaded successfully", "Navigation");

    // Try to find the PDF viewer/embed element
    let pdfViewerSelector = null;
    try {
        // Common selectors for PDF viewers in browsers
        const selectors = ['embed[type="application/pdf"]', 'object[type="application/pdf"]', 'iframe'];
        for (const selector of selectors) {
            const element = await page.locator(selector).first();
            if (await element.count() > 0) {
                pdfViewerSelector = selector;
                announce(`Found PDF viewer using selector: ${selector}`, "PDF Viewer");
                break;
            }
        }
    } catch (e) {
        announce("Could not find specific PDF viewer element, will use full page", "PDF Viewer");
    }

    // Use Agent with CUA (Computer Use Agent) mode for better PDF handling
    announce("Creating AI agent to extract information from the PDF...", "Agent");

    const agent = stagehand.agent({
        cua: true, // Enable Computer Use Agent mode for vision capabilities
        model: {
            modelName: "google/gemini-2.5-computer-use-preview-10-2025",
            apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
        },
        systemPrompt: `You are a helpful assistant that can read and extract information from PDF documents.
        You can see the PDF on screen and extract text from it.
        Be precise and only extract information you can clearly see.
        Always return your findings in valid JSON format.`,
    });

    announce("Agent extracting corporation information from the PDF...", "Agent");

    // Use the agent to extract information
    const agentResult = await agent.execute({
        instruction: `Look at the Articles of Incorporation PDF document visible on screen.
        Extract and return the following information in JSON format:
        1. The corporation name
        2. The province or territory where it's incorporated
        3. All incorporator names listed in the document
        
        If you can't see all the information on the current view, scroll down to see more.
        Return the data as: {"corporationName": "...", "province": "...", "incorporators": ["...", "..."]}`,
        maxSteps: 20,
        highlightCursor: true, // Highlight the cursor for better visibility during execution
    });

    announce(`Agent completed extraction`, "Agent");

    // Parse the agent's response to extract the structured data
    let corporationInfo = {
        corporationName: "",
        province: "",
        incorporators: [] as string[],
    };

    try {
        // Try to extract JSON from the agent's message
        const jsonMatch = agentResult.message.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsedData = JSON.parse(jsonMatch[0]);
            corporationInfo = {
                corporationName: parsedData.corporationName || "",
                province: parsedData.province || "",
                incorporators: Array.isArray(parsedData.incorporators) ? parsedData.incorporators : [],
            };
        } else {
            // Fallback: try to parse the message as text
            announce("Could not find JSON in agent response, parsing as text", "Agent");
            console.log("Agent message:", agentResult.message);

            // Try to extract information from text
            const nameMatch = agentResult.message.match(/corporation name[:\s]+([^\n,]+)/i);
            const provinceMatch = agentResult.message.match(/province[:\s]+([^\n,]+)/i);

            if (nameMatch) corporationInfo.corporationName = nameMatch[1].trim();
            if (provinceMatch) corporationInfo.province = provinceMatch[1].trim();

            // Try to find incorporator names (look for patterns like "1. Name" or "Name,")
            const incorporatorMatches = agentResult.message.match(/(?:incorporators?[:\s]+|[\d]+\.)\s*([A-Z][a-z]+\s+[A-Z][a-z]+)/gi);
            if (incorporatorMatches) {
                corporationInfo.incorporators = incorporatorMatches.map(m => m.replace(/^[\d]+\.\s*/, '').trim());
            }
        }
    } catch (e) {
        announce(`Error parsing agent response: ${e}`, "Agent");
        console.log("Raw agent message:", agentResult.message);
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
            `🏢 Corporation Name: ${corporationInfo.corporationName}`,
            `📍 Province: ${corporationInfo.province}`,
            `👥 Incorporators:`,
            ...corporationInfo.incorporators.map((name, index) => `   ${index + 1}. ${name}`),
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

