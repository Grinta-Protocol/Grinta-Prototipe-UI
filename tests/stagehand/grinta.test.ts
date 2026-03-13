import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

/**
 * Grinta Protocol - Stagehand E2E Test
 * This script uses Stagehand to perform AI-driven testing on the Grinta Protocol UI.
 */
async function runTest() {
    console.log("🚀 Starting Grinta UI Test with Stagehand...");

    const stagehand = new Stagehand({
        env: "LOCAL", // Use local browser for testing
        verbose: 1,
    });

    try {
        await stagehand.init();
        const page = stagehand.context.pages()[0];

        // 1. Navigate to the Grinta App
        const url = process.env.TEST_URL || "http://localhost:3000";
        console.log(`🔗 Navigating to ${url}...`);
        await page.goto(url);

        // 2. Perform AI-driven actions
        console.log("🤖 Asking Stagehand to explore the protocol...");
        await stagehand.act("Click the 'APP Tesnet' button to enter the protocol");

        // 3. Observe the state
        console.log("👀 Observing the dashboard...");
        const dashboardState = await stagehand.observe("What are the main sections visible in the dashboard sidebar?");
        console.log("Sidebar sections found:", dashboardState);

        // 4. Extract structured data from the UI
        console.log("📊 Extracting protocol metrics...");
        const metrics = await stagehand.extract(
            "Extract the current Redemption Price, Redemption Rate, and Market Price if visible.",
            z.object({
                redemptionPrice: z.string().optional(),
                redemptionRate: z.string().optional(),
                marketPrice: z.string().optional(),
            })
        );

        console.log("✅ Extracted metrics:", metrics);

        // 5. Test interaction
        console.log("🖱️ Testing 'Manage Safe' tab...");
        await stagehand.act("Switch to the 'Manage Safe' tab if not already there");

        // Check if the connect wallet prompt is visible
        const walletPrompt = await stagehand.observe("Is there a message saying 'Connect your wallet to interact with SAFEs'?");
        console.log("Wallet connection prompt status:", walletPrompt);

        console.log("🏁 Test completed successfully!");
    } catch (error) {
        console.error("❌ Test failed:", error);
    } finally {
        await stagehand.close();
    }
}

runTest();
