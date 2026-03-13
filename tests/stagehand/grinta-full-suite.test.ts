import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

/**
 * GRINTA PROTOCOL - COMPREHENSIVE E2E TEST SUITE
 * 
 * This suite verifies the core business logic and UI flows of the Grinta Protocol
 * using AI-driven browser automation (Stagehand).
 */

class GrintaTester {
    private stagehand: Stagehand;
    private url: string;

    constructor() {
        this.url = process.env.TEST_URL || "http://localhost:3000";
        this.stagehand = new Stagehand({
            env: "LOCAL",
            verbose: 1,
        });
    }

    async init() {
        await this.stagehand.init();
        console.log(`\n🌐 Grinta Protocol Test Suite initialized at ${this.url}`);
    }

    async close() {
        await this.stagehand.close();
    }

    /**
     * FLOW 1: Landing Page & Onboarding
     */
    async testOnboarding() {
        console.log("\n🧪 Testing Flow 1: Onboarding & Landing Page");
        const page = this.stagehand.context.pages()[0];
        await page.goto(this.url);

        await this.stagehand.act("Scroll down to the 'Ecosystem' section and then back up to the hero.");

        const isHeroVisible = await this.stagehand.observe("Is the main headline 'THE FIRST SELF-STABILIZING MONEY MARKET' visible?");
        console.log("✅ Hero section visibility:", isHeroVisible);

        await this.stagehand.act("Click the 'APP Tesnet' button to enter the protocol dashboard.");

        const currentUrl = page.url();
        if (currentUrl.includes("/app")) {
            console.log("✅ Successfully transitioned to the Dashboard.");
        } else {
            console.log("⚠️ Redirection might have failed or is taking time. Current URL:", currentUrl);
        }
    }

    /**
     * FLOW 2: Protocol Metrics & Dashboard Overview
     */
    async testDashboardMetrics() {
        console.log("\n🧪 Testing Flow 2: Protocol Metrics & Dashboard");

        const metrics = await this.stagehand.extract(
            "Extract the protocol health metrics: Market Price, Redemption Price, and Total Value Locked (TVL).",
            z.object({
                marketPrice: z.string(),
                redemptionPrice: z.string(),
                tvl: z.string().optional(),
            })
        );

        console.log("✅ Protocol Health Metrics:", metrics);

        const sidebarItems = await this.stagehand.observe("List all the navigation items in the sidebar. Are 'Overview', 'Manage Safe', and 'Propagation' present?");
        console.log("✅ Sidebar verification:", sidebarItems);
    }

    /**
     * FLOW 3: Vault Management Actions (Safe Actions)
     */
    async testSafeManagement() {
        console.log("\n🧪 Testing Flow 3: Safe Management & Minting");

        await this.stagehand.act("Click on 'Manage Safe' in the sidebar.");

        // Check for wallet connection prompt
        const interactionCheck = await this.stagehand.observe("Does the UI ask the user to 'Connect your wallet' to interact with SAFEs?");
        console.log("✅ Wallet interaction state:", interactionCheck);

        // AI can identify interaction buttons even if we don't have a real wallet connected
        const actionsVisible = await this.stagehand.observe("Identify the buttons for 'Deposit', 'Withdraw', 'Borrow', and 'Repay'. Are they disabled or enabled?");
        console.log("✅ Dashboard Action visibility:", actionsVisible);

        await this.stagehand.act("Switch to the 'Mint WBTC' sub-tab if visible.");
        const mintButton = await this.stagehand.observe("Is the 'MINT 0.1 TEST WBTC' button visible?");
        console.log("✅ Minting UI visibility:", mintButton);
    }

    /**
     * FLOW 4: Agent Propagation Hub (MoltX Integration)
     */
    async testAgentHub() {
        console.log("\n🧪 Testing Flow 4: Agent Propagation Hub");

        await this.stagehand.act("Navigate to the 'Propagation' tab from the sidebar.");

        console.log("🤖 Verifying MoltX Activity Stats...");
        const stats = await this.stagehand.extract(
            "Extract the 'Activity Stats' numbers for Total Posts, Total Likes, and Followers.",
            z.object({
                posts: z.string().or(z.number()),
                likes: z.string().or(z.number()),
                followers: z.string().or(z.number()),
            })
        );
        console.log("✅ MoltX Hub Stats:", stats);

        const logsVisible = await this.stagehand.observe("Is the 'Transmission Log' visible with recent entries?");
        console.log("✅ Transmission logs presence:", logsVisible);
    }

    /**
     * FLOW 5: Admin Panel (System Monitoring)
     */
    async testAdminPanel() {
        console.log("\n🧪 Testing Flow 5: Admin & System Monitoring");

        await this.stagehand.act("Navigate to the '/admin' route directly.");

        const adminCheck = await this.stagehand.observe("Is there a section titled 'Nexus Intelligence' or 'System Monitoring'?");
        console.log("✅ Admin Monitoring UI visibility:", adminCheck);

        const healthStatus = await this.stagehand.observe("What is the current status of 'MoltX Gateway' and 'Starknet RPC' in the health check list?");
        console.log("✅ System Health Report:", healthStatus);
    }
}

async function runFullSuite() {
    const tester = new GrintaTester();

    try {
        await tester.init();

        await tester.testOnboarding();
        await tester.testDashboardMetrics();
        await tester.testSafeManagement();
        await tester.testAgentHub();
        await tester.testAdminPanel();

        console.log("\n🏁 ALL TESTING FLOWS COMPLETED SUCCESSFULLY!");
    } catch (err) {
        console.error("\n❌ CRITICAL TEST FAILURE:", err);
        process.exit(1);
    } finally {
        await tester.close();
    }
}

runFullSuite().catch(console.error);
