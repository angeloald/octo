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
            `🤘 "Welcome to Stagehand Multi-Form FINTRAC Automation!"`,
            "",
            "Stagehand will automatically fill out TWO FINTRAC forms with corporate data.",
            "Watch as this demo performs the following steps:",
            "",
            "FORM 1 - Document Upload Form:",
            `📍 Step 1: Navigate to the Document Upload Form`,
            `📍 Step 2: Fill in all 4 document URLs`,
            `📍 Step 3: Submit Form 1`,
            "",
            "FORM 2 - Corporate Information Form:",
            `📍 Step 4: Navigate to the Corporate Information Form`,
            `📍 Step 5: Fill Page 1 (Legal Name & Business Number)`,
            `📍 Step 6: Click Next to Page 2`,
            `📍 Step 7: Fill Page 2 (UBO List & CCO Information)`,
            `📍 Step 8: Submit Form 2`,
        ].join("\n"),
    );

    // Get the page object from stagehand for navigation
    const page = stagehand.context.pages()[0];

    // ========== FORM 1: Document Upload Form ==========
    announce("========== STARTING FORM 1: DOCUMENT UPLOAD ==========", "Form 1");
    
    const form1Url = "https://docs.google.com/forms/d/e/1FAIpQLSdwWNLL8c7Y5yLvufQkvrmFF-Ip0CrjbRlEOB4TvTEymvQS0Q/viewform";
    announce(`Navigating to Form 1: ${form1Url}`, "Form 1");
    await page.goto(form1Url, { waitUntil: "domcontentloaded" });

    // Wait for Form 1 to load completely
    announce("Waiting for Form 1 to load...", "Form 1");
    await page.waitForLoadState("networkidle");
    
    // Give form extra time to fully render
    await new Promise(resolve => setTimeout(resolve, 2000));
    announce("Form 1 loaded successfully", "Form 1");

        // Define dummy data to fill in the FINTRAC Internal Form
    const dummyData = {
        // Page 1 - Document URLs
        msbRegistrationFormUrl: "https://example.com/documents/msb-registration-form.pdf",
        amlComplianceFormUrl: "https://example.com/documents/aml-compliance-form.pdf",
        riskAssessmentFormUrl: "https://example.com/documents/risk-assessment-form.pdf",
        ownershipControlFormUrl: "https://example.com/documents/ownership-control-form.pdf",
        // Legacy fields (may not be used in this form)
        legalNameOfCorporation: "MapleLeaf Financial Services Inc.",
        businessNumber: "123456789RT0001",
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
        
        announce("Starting to fill Form 1 document URL fields...", "Form 1");
        
        // Define the document URLs to fill
        const documentFields = [
            { name: "MSB Registration Form URL", value: dummyData.msbRegistrationFormUrl },
            { name: "AML Compliance Form URL", value: dummyData.amlComplianceFormUrl },
            { name: "Risk Assessment Form URL", value: dummyData.riskAssessmentFormUrl },
            { name: "Ownership & Control Form URL", value: dummyData.ownershipControlFormUrl }
        ];
        
        // Method 1: Try Stagehand act method first (most reliable for Google Forms)
        let filledSuccessfully = false;
        
        try {
            announce("Using Stagehand AI to fill all document URL fields...", "Form 1");
            
            for (const field of documentFields) {
                announce(`Filling ${field.name}...`, "Form 1");
                await stagehand.act(`Fill in the "${field.name}" field with "${field.value}"`);
                await new Promise(resolve => setTimeout(resolve, 1500));
                announce(`✓ Filled: ${field.name}`, "Form 1");
            }
            
            filledSuccessfully = true;
            announce("✓ All Form 1 fields filled successfully with Stagehand", "Form 1");
            
        } catch (stagehandError) {
            announce(`Stagehand method failed: ${stagehandError}. Trying direct selectors...`, "Form 1");
            
            // Method 2: Fallback to direct Playwright selectors
            try {
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
                        announce(`Found ${count} input fields with selector: ${selector}`, "Form 1");
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
                        announce(`✓ Filled field ${i + 1}: ${documentFields[i].name}`, "Form 1");
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                    filledSuccessfully = true;
                    announce("✓ All Form 1 fields filled with direct selectors", "Form 1");
                } else {
                    throw new Error(`Only found ${inputCount} input fields, need at least 4`);
                }
                
            } catch (directError) {
                announce(`Direct selector method also failed: ${directError}`, "Form 1");
            }
        }
        
        if (!filledSuccessfully) {
            announce("⚠️ WARNING: Could not fill Form 1 fields with any method", "Form 1");
        }

        // Submit Form 1
        announce("Form 1 fields filled, looking for Submit button...", "Form 1");
        await submitForm(page, stagehand);
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        announce("========== FORM 1 COMPLETE ==========", "Form 1");
        
        // ========== FORM 2: Corporate Information (Multi-Page) ==========
        announce("========== STARTING FORM 2: CORPORATE INFORMATION ==========", "Form 2");
        
        const form2Url = "https://docs.google.com/forms/d/e/1FAIpQLScqvClXCUBYZjr56QxZv-4cDWpsd93TKXeyYJBChg0qfPVa2g/viewform";
        announce(`Navigating to Form 2: ${form2Url}`, "Form 2");
        await page.goto(form2Url, { waitUntil: "domcontentloaded" });
        
        // Wait for Form 2 to load
        announce("Waiting for Form 2 to load...", "Form 2");
        await page.waitForLoadState("networkidle");
        await new Promise(resolve => setTimeout(resolve, 2000));
        announce("Form 2 loaded successfully", "Form 2");
        
        // Fill Form 2 Page 1: Legal Name and Business Number
        announce("Filling Form 2 Page 1: Legal Name and Business Number", "Form 2 - Page 1");
        
        const page1Fields = [
            { label: "Legal Name of Corporation", value: dummyData.legalNameOfCorporation },
            { label: "Business Number", value: dummyData.businessNumber }
        ];
        
        let page1Filled = false;
        
        // Method 1: Try Stagehand act method first
        try {
            announce("Using Stagehand AI to fill Page 1 fields...", "Form 2 - Page 1");
            
            for (const field of page1Fields) {
                announce(`Filling field: ${field.label} = ${field.value}`, "Form 2 - Page 1");
                await stagehand.act(`Fill in the "${field.label}" field with "${field.value}"`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                announce(`✓ Filled: ${field.label}`, "Form 2 - Page 1");
            }
            
            page1Filled = true;
            announce("✓ Page 1 fields filled successfully with Stagehand", "Form 2 - Page 1");
            
        } catch (stagehandError) {
            announce(`Stagehand method failed: ${stagehandError}. Trying direct selectors...`, "Form 2 - Page 1");
            
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
                        announce(`Found ${count} input fields with selector: ${selector}`, "Form 2 - Page 1");
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
                        announce(`✓ Filled field ${i + 1}: ${page1Fields[i].label} = ${page1Fields[i].value}`, "Form 2 - Page 1");
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                    page1Filled = true;
                    announce("✓ Page 1 fields filled with direct selectors", "Form 2 - Page 1");
                } else {
                    throw new Error(`Only found ${inputCount} input fields, need at least 2`);
                }
                
            } catch (directError) {
                announce(`Direct selector method also failed: ${directError}`, "Form 2 - Page 1");
            }
        }
        
        if (!page1Filled) {
            announce("⚠️ WARNING: Could not fill Form 2 Page 1 fields with any method", "Form 2 - Page 1");
        }
        
        // Click Next button to go to Page 2
        announce("Form 2 Page 1 complete, looking for Next button...", "Form 2 - Page 1");
        
        let nextButtonClicked = false;
        
        // Primary Method: Use Stagehand act (most reliable for Google Forms)
        try {
            announce("Using Stagehand to find and click Next button...", "Form 2 - Navigation");
            await stagehand.act("Click the Next button to go to the next page of the form");
            announce("Successfully clicked Next button with Stagehand", "Form 2 - Navigation");
            nextButtonClicked = true;
            
            // Wait for page 2 to load
            announce("Waiting for Form 2 Page 2 to load...", "Form 2 - Navigation");
            await new Promise(resolve => setTimeout(resolve, 4000));
            
            // Fill out page 2 with UBO and CCO information
            await fillPage2(page, stagehand, dummyData);
            
        } catch (stagehandError) {
            announce(`Stagehand Next button method failed: ${stagehandError}. Trying direct selectors...`, "Form 2 - Navigation");
            
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
                                announce(`Found visible Next button with selector: ${selector}`, "Form 2 - Navigation");
                                await nextButton.click();
                                announce("Clicked Next button with direct selector", "Form 2 - Navigation");
                                nextButtonClicked = true;
                                
                                // Wait for the next page to load
                                await new Promise(resolve => setTimeout(resolve, 4000));
                                
                                // Fill out page 2
                                await fillPage2(page, stagehand, dummyData);
                                
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
                announce(`Direct selector method failed: ${directError}`, "Form 2 - Navigation");
            }
        }
        
        if (!nextButtonClicked) {
            announce("⚠️ WARNING: Could not click Next button on Form 2 Page 1", "Form 2 - Navigation");
        }
        
        announce("========== FORM 2 COMPLETE ==========", "Form 2");

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
            "📋 FINTRAC Document URLs Submitted:",
            `   MSB Registration Form URL: ${dummyData.msbRegistrationFormUrl}`,
            `   AML Compliance Form URL: ${dummyData.amlComplianceFormUrl}`,
            `   Risk Assessment Form URL: ${dummyData.riskAssessmentFormUrl}`,
            `   Ownership & Control Form URL: ${dummyData.ownershipControlFormUrl}`,
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
                
                // Fill UBO List with Ownership Percentages in the first field
                announce("Filling UBO (Ultimate Beneficial Owner) information...", "Page 2");
                if (fieldIndex < inputCount) {
                    // Combine all UBOs into one field entry
                    const uboText = dummyData.uboList
                        .map((ubo: { name: string; ownershipPercentage: string }) => `${ubo.name} - ${ubo.ownershipPercentage}`)
                        .join(", ");
                    
                    const uboInput = page.locator('input[type="text"], textarea').nth(fieldIndex);
                    await uboInput.click();
                    await uboInput.fill(uboText);
                    announce(`Filled UBO List: ${uboText}`, "Page 2");
                    fieldIndex++;
                }
                
                // Fill Chief Compliance Officer information in the next field
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
        
        announce("Page 2 filling completed, now clicking Submit...", "Page 2");
        
        // After filling all Page 2 fields, click Submit button
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
            // Primary Method: Use Stagehand act to find and click Submit
            announce("Using Stagehand to find and click Submit button...", "Page 2");
            await stagehand.act("Click the Submit button to submit the form");
            announce("Successfully clicked Submit button with Stagehand", "Page 2");
        } catch (submitError) {
            announce(`Stagehand Submit method failed: ${submitError}. Trying direct selectors...`, "Page 2");
            
            // Fallback: Direct Playwright selectors
            const submitSelectors = [
                '[role="button"]:has-text("Submit")',
                'div[role="button"]:has-text("Submit")',
                'span:has-text("Submit")',
                'button[type="submit"]',
                'input[type="submit"]',
                'button:has-text("Submit")',
                '[jsname="M2UYVd"]'
            ];
            
            let submitClicked = false;
            for (const selector of submitSelectors) {
                try {
                    const submitButton = page.locator(selector).first();
                    const count = await submitButton.count();
                    
                    if (count > 0) {
                        const isVisible = await submitButton.isVisible();
                        if (isVisible) {
                            announce(`Found visible Submit button with selector: ${selector}`, "Page 2");
                            await submitButton.click();
                            announce("Clicked Submit button with direct selector", "Page 2");
                            submitClicked = true;
                            break;
                        }
                    }
                } catch {
                    continue;
                }
            }
            
            if (!submitClicked) {
                announce("Warning: Could not find or click Submit button", "Page 2");
            }
        }
        
    } catch (error) {
        announce(`Error filling page 2: ${error}`, "Page 2 Error");
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function submitForm(page: any, stagehand: any) {
    announce("Attempting to submit the form...", "Submit");
    
    // Wait a moment for any animations to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let submitClicked = false;
    
    // Primary Method: Use Stagehand act (most reliable for Google Forms)
    try {
        announce("Using Stagehand to find and click Submit button...", "Submit");
        await stagehand.act("Click the Submit button to submit the form");
        announce("✓ Successfully clicked Submit button with Stagehand", "Submit");
        submitClicked = true;
        
        // Wait for submission to complete
        await new Promise(resolve => setTimeout(resolve, 3000));
        
    } catch (stagehandError) {
        announce(`Stagehand Submit method failed: ${stagehandError}. Trying direct selectors...`, "Submit");
        
        // Fallback Method: Direct Playwright selectors
        const submitSelectors = [
            '[role="button"]:has-text("Submit")',
            'div[role="button"]:has-text("Submit")',
            'span:has-text("Submit")',
            'button[type="submit"]',
            'input[type="submit"]',
            'button:has-text("Submit")',
            '[aria-label*="Submit"]',
            '.appsMaterialWizButtonPaperbuttonLabel:has-text("Submit")',
            '[jsname="M2UYVd"]'
        ];
        
        for (const selector of submitSelectors) {
            try {
                const submitButton = page.locator(selector).first();
                const count = await submitButton.count();
                
                if (count > 0) {
                    const isVisible = await submitButton.isVisible();
                    if (isVisible) {
                        announce(`Found visible Submit button with selector: ${selector}`, "Submit");
                        await submitButton.click();
                        announce("✓ Clicked Submit button with direct selector", "Submit");
                        submitClicked = true;
                        
                        // Wait for submission to complete
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        break;
                    }
                }
            } catch (selectorError) {
                announce(`Failed with selector ${selector}: ${selectorError}`, "Submit");
                continue;
            }
        }
    }
    
    if (!submitClicked) {
        announce("⚠️ WARNING: Could not find or click Submit button", "Submit");
        throw new Error("Failed to click Submit button");
    } else {
        announce("✓ Form submitted successfully", "Submit");
    }
}

function announce(message: string, title?: string) {
    console.log({
        padding: 1,
        margin: 3,
        title: title || "Stagehand",
    });
}

