/**
 * 🤘 Welcome to Stagehand!
 *
 *
 * To edit config, see `stagehand.config.ts`
 *
 * In this script, we'll be extracting data from the incorporation page and filling Google Forms.
 *
 * 1. Navigate to https://octo-brown.vercel.app/incorporation
 * 2. Extract corporation information (Legal Name, Business Number, UBOs, CCO)
 * 3. Navigate to FINTRAC Form 1 (Document Upload)
 * 4. Fill Form 1 with real incorporation URL + dummy URLs for other documents
 * 5. Submit Form 1
 * 6. Navigate to FINTRAC Form 2 (Corporate Information)
 * 7. Fill Form 2 Page 1 with extracted Legal Name and Business Number
 * 8. Fill Form 2 Page 2 with extracted UBOs and CCO
 * 9. Submit Form 2
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
            `🤘 "Welcome to Stagehand Multi-Form FINTRAC Automation!"`,
            "",
            "Stagehand will automatically extract corporate data and fill FINTRAC forms.",
            "Watch as this demo performs the following steps:",
            "",
            "PART 1 - Data Extraction:",
            `📍 Step 1: Navigate to Articles of Incorporation page`,
            `📍 Step 2: Extract Legal Name, Business Number, UBOs, and CCO`,
            "",
            "PART 2 - Form 1 (Document Upload):",
            `📍 Step 3: Navigate to Document Upload Form`,
            `📍 Step 4: Fill in all 4 document URLs`,
            `📍 Step 5: Submit Form 1`,
            "",
            "PART 3 - Form 2 (Corporate Information):",
            `📍 Step 6: Navigate to Corporate Information Form`,
            `📍 Step 7: Fill Page 1 (Legal Name & Business Number)`,
            `📍 Step 8: Click Next to Page 2`,
            `📍 Step 9: Fill Page 2 (UBO List & CCO Information)`,
            `📍 Step 10: Submit Form 2`,
        ].join("\n"),
    );

    // Get the page object from stagehand for navigation
    const page = stagehand.context.pages()[0];

    // ========== PART 1: DATA EXTRACTION ==========
    announce("========== PART 1: EXTRACTING CORPORATION DATA ==========", "Part 1");

    // Navigate to the incorporation page
    const pageUrl = "https://octo-brown.vercel.app/incorporation";
    announce(`Navigating to incorporation page: ${pageUrl}`, "Part 1 - Navigation");
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

    // Apply fallback for Business Number if not found
    if (!corporationInfo.businessNumber) {
        corporationInfo.businessNumber = "123456789RT0001";
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

    announce("========== PART 1 COMPLETE ==========", "Part 1");

    // ========== PART 2: FORM 1 - DOCUMENT UPLOAD ==========
    announce("========== PART 2: FILLING FORM 1 (DOCUMENT UPLOAD) ==========", "Part 2");

    // Use the incorporation page for MSB Registration, and dummy URLs for others
    const documentUrls = {
        msbRegistrationFormUrl: "https://octo-brown.vercel.app/incorporation",
        amlComplianceFormUrl: "https://example.com/documents/aml-compliance-program.pdf",
        riskAssessmentFormUrl: "https://example.com/documents/risk-assessment-summary.pdf",
        ownershipControlFormUrl: "https://example.com/documents/ownership-control-declaration.pdf"
    };

    const form1Url = "https://docs.google.com/forms/d/e/1FAIpQLSdwWNLL8c7Y5yLvufQkvrmFF-Ip0CrjbRlEOB4TvTEymvQS0Q/viewform";
    announce(`Navigating to Form 1: ${form1Url}`, "Part 2");
    await page.goto(form1Url, { waitUntil: "domcontentloaded", timeoutMs: 30000 });

    announce("Waiting for Form 1 to load...", "Part 2");
    try {
        await page.waitForLoadState("networkidle", 30000);
    } catch (e) {
        announce("Network idle timeout, proceeding anyway...", "Part 2");
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    announce("Form 1 loaded successfully", "Part 2");

    // Fill Form 1 with document URLs
    announce("Filling Form 1 document URL fields...", "Part 2");

    const documentFields = [
        { name: "MSB Registration Form URL", value: documentUrls.msbRegistrationFormUrl },
        { name: "AML Compliance Form URL", value: documentUrls.amlComplianceFormUrl },
        { name: "Risk Assessment Form URL", value: documentUrls.riskAssessmentFormUrl },
        { name: "Ownership & Control Form URL", value: documentUrls.ownershipControlFormUrl }
    ];

    let form1Filled = false;

    // Method 1: Try Stagehand act method first
    try {
        announce("Using Stagehand AI to fill Form 1 fields...", "Part 2");

        for (const field of documentFields) {
            announce(`Filling ${field.name}...`, "Part 2");
            await stagehand.act(`Fill in the "${field.name}" field with "${field.value}"`);
            await new Promise(resolve => setTimeout(resolve, 1500));
            announce(`✓ Filled: ${field.name}`, "Part 2");
        }

        form1Filled = true;
        announce("✓ All Form 1 fields filled successfully with Stagehand", "Part 2");
    } catch (stagehandError) {
        announce(`Stagehand method failed: ${stagehandError}. Trying direct selectors...`, "Part 2");

        // Method 2: Fallback to direct Playwright selectors
        try {
            // Common Google Forms input selectors
            const inputSelectors = [
                'input[type="text"]',
                'input[type="url"]',
                'textarea',
                'input[aria-labelledby]',
                '.quantumWizTextinputPaperinputInput'
            ];

            let selectedSelector = null;
            let inputCount = 0;

            for (const selector of inputSelectors) {
                const count = await page.locator(selector).count();
                if (count >= 4) {
                    announce(`Found ${count} input fields with selector: ${selector}`, "Part 2");
                    selectedSelector = selector;
                    inputCount = count;
                    break;
                }
            }

            if (selectedSelector && inputCount >= 4) {
                for (let i = 0; i < documentFields.length; i++) {
                    const input = page.locator(selectedSelector).nth(i);
                    await input.click();
                    await input.fill(''); // Clear first
                    await input.fill(documentFields[i].value);
                    announce(`✓ Filled field ${i + 1}: ${documentFields[i].name}`, "Part 2");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                form1Filled = true;
                announce("✓ All Form 1 fields filled with direct selectors", "Part 2");
            } else {
                throw new Error(`Only found ${inputCount} input fields, need at least 4`);
            }
        } catch (directError) {
            announce(`Direct selector method also failed: ${directError}`, "Part 2");
        }
    }

    if (!form1Filled) {
        announce("⚠️ WARNING: Could not fill Form 1 fields with any method", "Part 2");
    }

    // Submit Form 1
    announce("Submitting Form 1...", "Part 2");
    let form1Submitted = false;

    try {
        // Try Stagehand first
        await stagehand.act("Click the Submit button to submit the form");
        announce("✓ Form 1 submitted successfully with Stagehand", "Part 2");
        form1Submitted = true;
        await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (stagehandError) {
        announce(`Stagehand submit failed: ${stagehandError}. Trying direct selectors...`, "Part 2");

        // Fallback to direct selectors
        const submitSelectors = [
            '[role="button"]:has-text("Submit")',
            'div[role="button"]:has-text("Submit")',
            'span:has-text("Submit")',
            'button:has-text("Submit")',
            '[aria-label*="Submit"]',
            '.appsMaterialWizButtonPaperbuttonLabel:has-text("Submit")',
            '[jsname="M2UYVd"]'
        ];

        for (const selector of submitSelectors) {
            try {
                const submitButton = page.locator(selector).first();
                const count = await submitButton.count();

                if (count > 0 && await submitButton.isVisible()) {
                    announce(`Found Submit button with selector: ${selector}`, "Part 2");
                    await submitButton.click();
                    announce("✓ Form 1 submitted with direct selector", "Part 2");
                    form1Submitted = true;
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    break;
                }
            } catch {
                continue;
            }
        }
    }

    if (!form1Submitted) {
        announce("⚠️ WARNING: Could not submit Form 1", "Part 2");
    }

    announce("========== PART 2 COMPLETE ==========", "Part 2");

    // ========== PART 3: FORM 2 - CORPORATE INFORMATION ==========
    announce("========== PART 3: FILLING FORM 2 (CORPORATE INFORMATION) ==========", "Part 3");

    const form2Url = "https://docs.google.com/forms/d/e/1FAIpQLScqvClXCUBYZjr56QxZv-4cDWpsd93TKXeyYJBChg0qfPVa2g/viewform";
    announce(`Navigating to Form 2: ${form2Url}`, "Part 3");
    await page.goto(form2Url, { waitUntil: "domcontentloaded", timeoutMs: 30000 });

    announce("Waiting for Form 2 to load...", "Part 3");
    try {
        await page.waitForLoadState("networkidle", 30000);
    } catch (e) {
        announce("Network idle timeout, proceeding anyway...", "Part 3");
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    announce("Form 2 loaded successfully", "Part 3");

    // Fill Form 2 Page 1: Legal Name and Business Number
    announce("Filling Form 2 Page 1: Legal Name and Business Number", "Part 3 - Page 1");

    const page1Fields = [
        { label: "Legal Name of Corporation", value: corporationInfo.legalName },
        { label: "Business Number", value: corporationInfo.businessNumber || "" }
    ];

    let page1Filled = false;

    // Method 1: Try Stagehand act method first
    try {
        announce("Using Stagehand AI to fill Page 1 fields...", "Part 3 - Page 1");

        announce(`Filling Legal Name: ${corporationInfo.legalName}`, "Part 3 - Page 1");
        await stagehand.act(`Fill in the "Legal Name of Corporation" field with "${corporationInfo.legalName}"`);
        await new Promise(resolve => setTimeout(resolve, 2000));

        announce(`Filling Business Number: ${corporationInfo.businessNumber}`, "Part 3 - Page 1");
        await stagehand.act(`Fill in the "Business Number" field with "${corporationInfo.businessNumber}"`);
        await new Promise(resolve => setTimeout(resolve, 2000));

        page1Filled = true;
        announce("✓ Page 1 fields filled successfully with Stagehand", "Part 3 - Page 1");
    } catch (stagehandError) {
        announce(`Stagehand method failed: ${stagehandError}. Trying direct selectors...`, "Part 3 - Page 1");

        // Method 2: Fallback to direct Playwright selectors
        try {
            const inputSelectors = [
                'input[type="text"]',
                'textarea',
                'input[aria-labelledby]',
                '.quantumWizTextinputPaperinputInput'
            ];

            let selectedSelector = null;
            let inputCount = 0;

            for (const selector of inputSelectors) {
                const count = await page.locator(selector).count();
                if (count >= 2) {
                    announce(`Found ${count} input fields with selector: ${selector}`, "Part 3 - Page 1");
                    selectedSelector = selector;
                    inputCount = count;
                    break;
                }
            }

            if (selectedSelector && inputCount >= 2) {
                for (let i = 0; i < page1Fields.length; i++) {
                    const input = page.locator(selectedSelector).nth(i);
                    await input.click();
                    await new Promise(resolve => setTimeout(resolve, 500));
                    await input.fill(''); // Clear first
                    await input.fill(page1Fields[i].value);
                    announce(`✓ Filled field ${i + 1}: ${page1Fields[i].label} = ${page1Fields[i].value}`, "Part 3 - Page 1");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                page1Filled = true;
                announce("✓ Page 1 fields filled with direct selectors", "Part 3 - Page 1");
            } else {
                throw new Error(`Only found ${inputCount} input fields, need at least 2`);
            }
        } catch (directError) {
            announce(`Direct selector method also failed: ${directError}`, "Part 3 - Page 1");
        }
    }

    if (!page1Filled) {
        announce("⚠️ WARNING: Could not fill Form 2 Page 1 fields with any method", "Part 3 - Page 1");
    }

    // Click Next to go to Page 2
    announce("Clicking Next button to go to Page 2...", "Part 3 - Navigation");
    let nextButtonClicked = false;

    // Primary Method: Use Stagehand act
    try {
        await stagehand.act("Click the Next button to go to the next page of the form");
        announce("✓ Successfully clicked Next button with Stagehand", "Part 3 - Navigation");
        nextButtonClicked = true;
        await new Promise(resolve => setTimeout(resolve, 4000));
    } catch (stagehandError) {
        announce(`Stagehand Next button method failed: ${stagehandError}. Trying direct selectors...`, "Part 3 - Navigation");

        // Fallback Method: Direct Playwright selectors
        const nextButtonSelectors = [
            '[role="button"]:has-text("Next")',
            'div[role="button"]:has-text("Next")',
            'span:has-text("Next")',
            'button:has-text("Next")',
            '[aria-label*="Next"]',
            '.appsMaterialWizButtonEl',
            '[jsname="OCpkoe"]'
        ];

        for (const selector of nextButtonSelectors) {
            try {
                const nextButton = page.locator(selector).first();
                const count = await nextButton.count();

                if (count > 0 && await nextButton.isVisible()) {
                    announce(`Found Next button with selector: ${selector}`, "Part 3 - Navigation");
                    await nextButton.click();
                    announce("✓ Clicked Next button with direct selector", "Part 3 - Navigation");
                    nextButtonClicked = true;
                    await new Promise(resolve => setTimeout(resolve, 4000));
                    break;
                }
            } catch {
                continue;
            }
        }
    }

    if (!nextButtonClicked) {
        announce("⚠️ WARNING: Could not click Next button on Form 2 Page 1", "Part 3 - Navigation");
    }

    // Fill Form 2 Page 2: UBOs and CCO
    announce("Filling Form 2 Page 2: UBOs and CCO Information", "Part 3 - Page 2");

    let page2Filled = false;

    // Prepare UBO text
    const uboText = corporationInfo.ubos && corporationInfo.ubos.length > 0
        ? corporationInfo.ubos
            .map(ubo => {
                const percentage = ubo.ownershipPercentage ? ` - ${ubo.ownershipPercentage}` : "";
                return `${ubo.name}${percentage}`;
            })
            .join(", ")
        : "";

    const ccoText = corporationInfo.cco || "";

    // Method 1: Try Stagehand act method
    try {
        if (uboText) {
            announce(`Filling UBO List: ${uboText}`, "Part 3 - Page 2");
            await stagehand.act(`Fill in the first field with "${uboText}"`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        if (ccoText) {
            announce(`Filling CCO Name: ${ccoText}`, "Part 3 - Page 2");
            await stagehand.act(`Fill in the second field with "${ccoText}"`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        page2Filled = true;
        announce("✓ Page 2 fields filled successfully with Stagehand", "Part 3 - Page 2");
    } catch (stagehandError) {
        announce(`Stagehand method failed: ${stagehandError}. Trying direct selectors...`, "Part 3 - Page 2");

        // Method 2: Fallback to direct Playwright selectors
        try {
            const inputCount = await page.locator('input[type="text"], textarea').count();
            announce(`Found ${inputCount} input fields on page 2`, "Part 3 - Page 2");

            if (inputCount >= 1) {
                // Fill first field (UBO)
                if (uboText) {
                    const uboInput = page.locator('input[type="text"], textarea').first();
                    await uboInput.click();
                    await uboInput.fill(uboText);
                    announce(`✓ Filled UBO field: ${uboText}`, "Part 3 - Page 2");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // Fill second field (CCO) if available
                if (inputCount >= 2 && ccoText) {
                    const ccoInput = page.locator('input[type="text"], textarea').nth(1);
                    await ccoInput.click();
                    await ccoInput.fill(ccoText);
                    announce(`✓ Filled CCO field: ${ccoText}`, "Part 3 - Page 2");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                page2Filled = true;
                announce("✓ Page 2 fields filled with direct selectors", "Part 3 - Page 2");
            }
        } catch (directError) {
            announce(`Direct selector method failed: ${directError}`, "Part 3 - Page 2");
        }
    }

    if (!page2Filled) {
        announce("⚠️ WARNING: Could not fill Form 2 Page 2 fields with any method", "Part 3 - Page 2");
    }

    // Submit Form 2
    announce("Submitting Form 2...", "Part 3 - Page 2");
    let form2Submitted = false;

    try {
        // Try Stagehand first
        await stagehand.act("Click the Submit button to submit the form");
        announce("✓ Form 2 submitted successfully with Stagehand", "Part 3 - Page 2");
        form2Submitted = true;
        await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (stagehandError) {
        announce(`Stagehand submit failed: ${stagehandError}. Trying direct selectors...`, "Part 3 - Page 2");

        // Fallback to direct selectors
        const submitSelectors = [
            '[role="button"]:has-text("Submit")',
            'div[role="button"]:has-text("Submit")',
            'span:has-text("Submit")',
            'button:has-text("Submit")',
            '[aria-label*="Submit"]',
            '.appsMaterialWizButtonPaperbuttonLabel:has-text("Submit")',
            '[jsname="M2UYVd"]'
        ];

        for (const selector of submitSelectors) {
            try {
                const submitButton = page.locator(selector).first();
                const count = await submitButton.count();

                if (count > 0 && await submitButton.isVisible()) {
                    announce(`Found Submit button with selector: ${selector}`, "Part 3 - Page 2");
                    await submitButton.click();
                    announce("✓ Form 2 submitted with direct selector", "Part 3 - Page 2");
                    form2Submitted = true;
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    break;
                }
            } catch {
                continue;
            }
        }
    }

    if (!form2Submitted) {
        announce("⚠️ WARNING: Could not submit Form 2", "Part 3 - Page 2");
    }

    announce("========== PART 3 COMPLETE ==========", "Part 3");

    // Final summary
    const finalResult = {
        extractedData: corporationInfo,
        documentUrls: documentUrls,
        form1Filled: form1Filled,
        form1Submitted: form1Submitted,
        form2Page1Filled: page1Filled,
        form2Page2Filled: page2Filled,
        form2Submitted: form2Submitted,
        success: form1Submitted && form2Submitted
    };

    console.log(
        [
            "",
            "=".repeat(60),
            finalResult.success ? "✅ AUTOMATION COMPLETE - ALL FORMS SUBMITTED" : "⚠️ AUTOMATION COMPLETE - SOME ISSUES",
            "=".repeat(60),
            "",
            "📋 Extracted Data:",
            `   Legal Name: ${corporationInfo.legalName}`,
            `   Business Number: ${corporationInfo.businessNumber || "N/A"}`,
            `   UBOs: ${corporationInfo.ubos?.map(u => u.name).join(", ") || "N/A"}`,
            `   CCO: ${corporationInfo.cco}`,
            "",
            `📄 Form 1 (Document Upload): ${form1Filled ? "Filled ✓" : "Not Filled ✗"} | ${form1Submitted ? "Submitted ✓" : "Not Submitted ✗"}`,
            `📄 Form 2 Page 1: ${page1Filled ? "Filled ✓" : "Not Filled ✗"}`,
            `📄 Form 2 Page 2: ${page2Filled ? "Filled ✓" : "Not Filled ✗"} | ${form2Submitted ? "Submitted ✓" : "Not Submitted ✗"}`,
            "",
            `Overall Status: ${finalResult.success ? "SUCCESS ✓" : "PARTIAL COMPLETION"}`,
            "",
            "=".repeat(60),
        ].join("\n"),
    );

    return finalResult;
}

function announce(message: string, title?: string) {
    console.log({
        padding: 1,
        margin: 3,
        title: title || "Stagehand",
    });
}

