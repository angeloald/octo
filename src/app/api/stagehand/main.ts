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
            `🤘 "Welcome to Stagehand Multi-Page FINTRAC Forms Automation!"`,
            "",
            "Stagehand will automatically fill out the multi-page FINTRAC Internal Form with corporate data.",
            "Watch as this demo performs the following steps:",
            "",
            `📍 Step 1: Navigate to the FINTRAC Google Form`,
            `📍 Step 2: Fill in Page 1 - Legal Name of Corporation & Business Number`,
            `📍 Step 3: Click Next to proceed to Page 2`,
            `📍 Step 4: Fill in Page 2 - UBO List with Ownership Percentages`,
            `📍 Step 5: Fill in Chief Compliance Officer (CCO) information`,
            `📍 Step 6: Submit the completed multi-page form`,
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
        emailAddress: "compliance@mapleleaffinancial.ca",
        // Page 2 - UBO and CCO Information
        uboList: [
            { name: "Michael Chen", ownershipPercentage: "35%" },
            { name: "Emily Rodriguez", ownershipPercentage: "30%" },
            { name: "David Thompson", ownershipPercentage: "25%" },
            { name: "Lisa Wang", ownershipPercentage: "10%" }
        ],
        chiefComplianceOfficer: "Jennifer Mitchell",
        ccoTitle: "Chief Compliance Officer",
        ccoEmail: "j.mitchell@mapleleaffinancial.ca",
        ccoPhone: "416-555-0199"
    };    announce("Using Stagehand to fill out the Google Form...", "Automation");

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

        // After filling the first page, look for Next button first (before submit)
        announce("Looking for Next button to proceed to page 2...", "Automation");
        
        // Wait a moment for any animations to complete
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        let nextButtonClicked = false;
        
        // Primary Method: Use Stagehand act (most reliable for Google Forms)
        try {
            announce("Using Stagehand to find and click Next button...", "Automation");
            await stagehand.act("Click the Next button to go to the next page of the form");
            announce("Successfully clicked Next button with Stagehand", "Automation");
            nextButtonClicked = true;
            
            // Wait for page 2 to load
            announce("Waiting for page 2 to load...", "Automation");
            await new Promise(resolve => setTimeout(resolve, 4000));
            
            // Fill out page 2 with UBO and CCO information
            await fillPage2(page, stagehand, dummyData);
            
            // After filling page 2, submit the form
            announce("Page 2 completed, now submitting the form...", "Automation");
            await submitForm(page, stagehand);
            
        } catch (stagehandError) {
            announce(`Stagehand Next button method failed: ${stagehandError}. Trying direct selectors...`, "Automation");
            
            // Fallback Method: Direct Playwright selectors
            try {
                const nextButtonSelectors = [
                    '[role="button"]:has-text("Next")',
                    'div[role="button"]:has-text("Next")',
                    'span:has-text("Next")',
                    'button:has-text("Next")',
                    'input[value*="Next"]',
                    '.appsMaterialWizButtonEl',
                    '[jsname="OCpkoe"]'
                ];
                
                for (const selector of nextButtonSelectors) {
                    try {
                        const nextButton = page.locator(selector).first();
                        const count = await nextButton.count();
                        
                        if (count > 0) {
                            const isVisible = await nextButton.isVisible();
                            if (isVisible) {
                                announce(`Found visible Next button with selector: ${selector}`, "Automation");
                                await nextButton.click();
                                announce("Clicked Next button with direct selector", "Automation");
                                nextButtonClicked = true;
                                
                                // Wait for the next page to load
                                await new Promise(resolve => setTimeout(resolve, 4000));
                                
                                // Fill out page 2
                                await fillPage2(page, stagehand, dummyData);
                                
                                // Submit after filling page 2
                                await submitForm(page, stagehand);
                                
                                break;
                            }
                        }
                    } catch {
                        // Continue to next selector
                        continue;
                    }
                }
                
                if (!nextButtonClicked) {
                    throw new Error("No visible Next button found with any selector");
                }
                
            } catch (directError) {
                announce(`Direct selector method failed: ${directError}`, "Automation");
            }
        }
        
        // If Next button was never clicked, this is a single-page form
        if (!nextButtonClicked) {
            announce("No Next button found - this appears to be a single-page form. Submitting now...", "Automation");
            await submitForm(page, stagehand);
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
            "Page 1:",
            `   Legal Name of Corporation: ${dummyData.legalNameOfCorporation}`,
            `   Business Number: ${dummyData.businessNumber}`,
            `   Incorporation Number: ${dummyData.incorporationNumber}`,
            `   Business Address: ${dummyData.businessAddress}`,
            `   Contact Person: ${dummyData.contactPerson}`,
            `   Phone: ${dummyData.phoneNumber}`,
            `   Email: ${dummyData.emailAddress}`,
            "",
            "Page 2:",
            `   UBO List: ${dummyData.uboList.map((ubo: { name: string; ownershipPercentage: string }) => `${ubo.name} (${ubo.ownershipPercentage})`).join(", ")}`,
            `   Chief Compliance Officer: ${dummyData.chiefComplianceOfficer}`,
            `   CCO Email: ${dummyData.ccoEmail}`,
            `   CCO Phone: ${dummyData.ccoPhone}`,
            "",
            "=".repeat(60),
        ].join("\n"),
    );

    return submissionResult;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fillPage2(page: any, stagehand: any, dummyData: any) {
    announce("Starting to fill Page 2 - UBO and CCO Information", "Page 2");
    
    try {
        // Method 1: Try direct input filling for Page 2
        try {
            const inputCount = await page.locator('input[type="text"], textarea').count();
            announce(`Found ${inputCount} input fields on page 2`, "Page 2");
            
            if (inputCount > 0) {
                let fieldIndex = 0;
                
                // Fill UBO List with Ownership Percentages
                announce("Filling UBO (Ultimate Beneficial Owner) information...", "Page 2");
                for (const ubo of dummyData.uboList) {
                    if (fieldIndex < inputCount) {
                        // Fill UBO Name
                        const nameInput = page.locator('input[type="text"], textarea').nth(fieldIndex);
                        await nameInput.click();
                        await nameInput.fill(`${ubo.name} - ${ubo.ownershipPercentage}`);
                        announce(`Filled UBO ${fieldIndex + 1}: ${ubo.name} - ${ubo.ownershipPercentage}`, "Page 2");
                        fieldIndex++;
                    }
                }
                
                // Fill Chief Compliance Officer information
                if (fieldIndex < inputCount) {
                    announce("Filling Chief Compliance Officer (CCO) information...", "Page 2");
                    const ccoInput = page.locator('input[type="text"], textarea').nth(fieldIndex);
                    await ccoInput.click();
                    await ccoInput.fill(dummyData.chiefComplianceOfficer);
                    announce(`Filled CCO Name: ${dummyData.chiefComplianceOfficer}`, "Page 2");
                    fieldIndex++;
                }
                
                // Fill any additional CCO fields
                if (fieldIndex < inputCount) {
                    const additionalCcoFields = [
                        dummyData.ccoTitle,
                        dummyData.ccoEmail,
                        dummyData.ccoPhone
                    ];
                    
                    for (let i = 0; i < additionalCcoFields.length && fieldIndex < inputCount; i++) {
                        const additionalInput = page.locator('input[type="text"], textarea').nth(fieldIndex);
                        await additionalInput.click();
                        await additionalInput.fill(additionalCcoFields[i]);
                        announce(`Filled additional CCO field ${fieldIndex + 1}: ${additionalCcoFields[i]}`, "Page 2");
                        fieldIndex++;
                    }
                }
            }
        } catch (directError) {
            announce(`Direct method failed on page 2: ${directError}. Using Stagehand act method...`, "Page 2");
            
            // Method 2: Fallback to Stagehand act method
            announce("Using Stagehand to fill UBO information...", "Page 2");
            
            // Fill UBO List
            for (let i = 0; i < dummyData.uboList.length; i++) {
                const ubo = dummyData.uboList[i];
                await stagehand.act(`Fill in any UBO or Ultimate Beneficial Owner field ${i + 1} with "${ubo.name} - ${ubo.ownershipPercentage}"`);
            }
            
            // Fill CCO information
            await stagehand.act(`Fill in the Chief Compliance Officer or CCO name field with "${dummyData.chiefComplianceOfficer}"`);
            await stagehand.act(`If there is a CCO title field, fill it with "${dummyData.ccoTitle}"`);
            await stagehand.act(`If there is a CCO email field, fill it with "${dummyData.ccoEmail}"`);
            await stagehand.act(`If there is a CCO phone field, fill it with "${dummyData.ccoPhone}"`);
        }
        
        announce("Page 2 filling completed", "Page 2");
        
    } catch (error) {
        announce(`Error filling page 2: ${error}`, "Page 2 Error");
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function submitForm(page: any, stagehand: any) {
    announce("Attempting to submit the form...", "Submit");
    
    try {
        // Try direct Playwright approach first
        const submitButton = page.locator('input[type="submit"], button[type="submit"], [role="button"]:has-text("Submit"), button:has-text("Submit")').first();
        if (await submitButton.count() > 0) {
            await submitButton.click();
            announce("Clicked submit button directly", "Submit");
        } else {
            throw new Error("No submit button found with direct selectors");
        }
    } catch {
        // Fallback to Stagehand act method
        announce("Using Stagehand to find and click submit button...", "Submit");
        await stagehand.act("Find and click the Submit button to submit the form");
    }
}

function announce(message: string, title?: string) {
    console.log({
        padding: 1,
        margin: 3,
        title: title || "Stagehand",
    });
}

