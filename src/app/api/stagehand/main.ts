/**
 * 🤘 Welcome to Stagehand!
 *
 *
 * To edit config, see `stagehand.config.ts`
 *
 * In this script, we'll be automating FINTRAC Internal Form submission with corporate data.
 *
 * 1. Navigate to the FINTRAC Google Form
 * 2. Fill out corporation legal name and business number
 * 3. Fill any additional corporate information fields
 * 4. Submit the form
 */

import { Stagehand } from "@browserbasehq/stagehand";

export async function main({
    stagehand,
}: {
    stagehand: Stagehand; // Stagehand instance
}) {
    console.log(
        [
            `🤘 "Welcome to Stagehand FINTRAC Forms Automation!"`,
            "",
            "Stagehand will automatically fill out the FINTRAC Internal Form with corporate data.",
            "Watch as this demo performs the following steps:",
            "",
            `📍 Step 1: Navigate to the FINTRAC Google Form`,
            `📍 Step 2: Fill in Legal Name of Corporation`,
            `📍 Step 3: Fill in Business Number`,
            `📍 Step 4: Fill any additional corporate fields`,
            `📍 Step 5: Submit the form`,
        ].join("\n"),
    );

    // Get the page object from stagehand for navigation
    const page = stagehand.context.pages()[0];

    // Navigate to the Google Form
    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLScqvClXCUBYZjr56QxZv-4cDWpsd93TKXeyYJBChg0qfPVa2g/viewform";
    announce(`Navigating to Google Form: ${formUrl}`, "Navigation");
    await page.goto(formUrl, { waitUntil: "domcontentloaded" });

    // Wait for the form to load completely
    announce("Waiting for Google Form to load...", "Navigation");
    await page.waitForLoadState("networkidle");
    
    // Give form extra time to fully render
    await new Promise(resolve => setTimeout(resolve, 2000));
    announce("Google Form loaded successfully", "Navigation");

    // Define dummy data to fill in the FINTRAC Internal Form
    const dummyData = {
        legalNameOfCorporation: "MapleLeaf Financial Services Inc.",
        businessNumber: "123456789RT0001",
        // Additional fields that might appear
        incorporationNumber: "1234567",
        registrationDate: "2020-01-15",
        businessAddress: "789 Bay Street, Toronto, ON M5G 2N7",
        principalBusinessActivity: "Financial Services and Money Transfer",
        contactPerson: "Sarah Johnson",
        phoneNumber: "416-555-0198",
        emailAddress: "compliance@mapleleaffinancial.ca"
    };

    announce("Using Stagehand to fill out the Google Form...", "Automation");

    // Use Stagehand's built-in methods to interact with form elements
    announce("Analyzing form fields...", "Automation");

    try {
        // Wait for form to be fully loaded
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Use more specific targeting for Google Forms input fields
        announce("Looking for Google Form input fields...", "Automation");
        
        // Method 1: Try direct Playwright selectors for Google Forms
        try {
            // Google Forms typically use these selectors for text inputs
            const inputCount = await page.locator('input[type="text"], textarea').count();
            
            if (inputCount >= 2) {
                announce(`Found ${inputCount} input fields, filling them directly...`, "Automation");
                
                // Fill the first input (Legal Name of Corporation)
                const firstInput = page.locator('input[type="text"], textarea').first();
                await firstInput.click();
                await firstInput.fill(dummyData.legalNameOfCorporation);
                announce(`Filled first field with: ${dummyData.legalNameOfCorporation}`, "Automation");
                
                // Fill the second input (Business Number)
                const secondInput = page.locator('input[type="text"], textarea').nth(1);
                await secondInput.click();
                await secondInput.fill(dummyData.businessNumber);
                announce(`Filled second field with: ${dummyData.businessNumber}`, "Automation");
                
                // Fill any additional inputs if they exist
                const additionalData = [
                    dummyData.incorporationNumber,
                    dummyData.businessAddress,
                    dummyData.contactPerson,
                    dummyData.phoneNumber,
                    dummyData.emailAddress
                ];
                
                for (let i = 2; i < inputCount && (i - 2) < additionalData.length; i++) {
                    const additionalInput = page.locator('input[type="text"], textarea').nth(i);
                    await additionalInput.click();
                    await additionalInput.fill(additionalData[i - 2]);
                    announce(`Filled additional field ${i + 1} with: ${additionalData[i - 2]}`, "Automation");
                }
            } else {
                throw new Error("Not enough input fields found, trying Stagehand act method");
            }
            
        } catch (directError) {
            announce(`Direct input method failed: ${directError}. Trying Stagehand act method...`, "Automation");
            
            // Method 2: Fallback to Stagehand's act method with more specific instructions
            announce("Using Stagehand act method to fill Legal Name of Corporation...", "Automation");
            await stagehand.act(`Click on the text input field under "Legal Name of Corporation" and type "${dummyData.legalNameOfCorporation}"`);

            announce("Using Stagehand act method to fill Business Number...", "Automation");
            await stagehand.act(`Click on the text input field under "Business Number" and type "${dummyData.businessNumber}"`);
        }

        // Try to find and click submit button
        announce("Looking for submit button...", "Automation");
        
        try {
            // Try direct Playwright approach first
            const submitButton = page.locator('input[type="submit"], button[type="submit"], [role="button"]:has-text("Submit")').first();
            if (await submitButton.count() > 0) {
                await submitButton.click();
                announce("Clicked submit button directly", "Automation");
            } else {
                throw new Error("No submit button found with direct selectors");
            }
        } catch {
            // Fallback to Stagehand act method
            announce("Using Stagehand to find and click submit button...", "Automation");
            await stagehand.act("Find and click the Submit button to submit the form");
        }

        announce("Form filling and submission completed!", "Automation");

    } catch (error) {
        announce(`Error during form filling: ${error}`, "Error");
    }

    // Check if the form was successfully submitted
    const submissionResult = {
        success: false,
        message: "Form submission attempted",
        automationResponse: "Stagehand automation completed",
        filledData: dummyData,
    };

    try {
        // Look for success indicators on the page
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait a bit for any redirect or confirmation
        
        const currentUrl = page.url();
        const pageText = await page.locator('body').textContent();
        
        // Common success indicators for Google Forms
        const successIndicators = [
            'Your response has been recorded',
            'Thank you',
            'Response recorded',
            'Submitted',
            'form has been submitted'
        ];
        
        const hasSuccessIndicator = successIndicators.some(indicator => 
            pageText?.toLowerCase().includes(indicator.toLowerCase()) || 
            currentUrl.includes('formResponse') || 
            currentUrl.includes('response')
        );
        
        if (hasSuccessIndicator) {
            submissionResult.success = true;
            submissionResult.message = "Form successfully submitted!";
        }
        
    } catch (error) {
        console.log("Error checking submission status:", error);
        submissionResult.message = "Form submission status unclear";
    }

    announce(
        `Form submission completed:\n\n${JSON.stringify(submissionResult, null, 2)}`,
        "Submission Complete",
    );

    console.log(
        [
            "",
            "=".repeat(60),
            "� GOOGLE FORM SUBMISSION RESULTS",
            "=".repeat(60),
            "",
            `✅ Success: ${submissionResult.success}`,
            `📄 Message: ${submissionResult.message}`,
            `🤖 Automation Response: ${submissionResult.automationResponse}`,
            "",
            "📋 FINTRAC Data Used:",
            `   Legal Name of Corporation: ${dummyData.legalNameOfCorporation}`,
            `   Business Number: ${dummyData.businessNumber}`,
            `   Incorporation Number: ${dummyData.incorporationNumber}`,
            `   Business Address: ${dummyData.businessAddress}`,
            `   Contact Person: ${dummyData.contactPerson}`,
            `   Phone: ${dummyData.phoneNumber}`,
            `   Email: ${dummyData.emailAddress}`,
            "",
            "=".repeat(60),
        ].join("\n"),
    );

    return submissionResult;
}

function announce(message: string, title?: string) {
    console.log({
        padding: 1,
        margin: 3,
        title: title || "Stagehand",
    });
}

