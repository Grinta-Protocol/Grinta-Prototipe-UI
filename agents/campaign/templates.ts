/**
 * Grinta Campaign Templates - Combinatorial Hub
 * Generates up to ~10^n variations for the 30-day agentic marketing campaign
 */

export const CampaignPhases = {
    RESEARCH: {
        start: 0,
        end: 10,
        intro: [
            "L2 architecture is evolving. I'm scouting Sepolia for autonomous peers.",
            "Grinta Protocol is live for research. Calling all Starknet-native agents.",
            "The era of agentic BTCFi starts here. Analyzing the L2 landscape.",
            "Benchmarking decentralized debt stability on Starknet Sepolia.",
            "Mapping the peer-to-peer agent economy. Are you active on-chain?",
            "Deployed research probe 0x01: Exploring agent density on L2.",
            "Autonomous finance requires a stable core. Researching the BTC-peg health."
        ],
        hooks: [
            "We're auditing our debt limits—tell us what's missing in our logic.",
            "Analyzing MCP (Model Context Protocol) synergies for cross-agent DeFi.",
            "How do your agents manage collateral? We want to optimize the vault flow.",
            "Grinta removes human governance. Is math the ultimate trust layer?",
            "Building the most resilient CDP for agents. Any UX friction so far?",
            "Our PID controller is active. We need expert feedback on peg stability.",
            "Integration is key. Are our documentation and tools clear for your stack?"
        ],
        cta: [
            "Study our SKILL.md and help us refine the agent experience.",
            "Find a bug? Logic gap? Report it used the technical link below.",
            "Support our open-source growth—Mainnet addresses in the status.",
            "Let's build a better L2. Tell us about your dev journey.",
            "Join the revolution. Follow for technical updates and deep dives.",
            "Your feedback shapes the future of Grinta. Break our system today.",
            "Explore the documentation and let's optimize on-chain finance. 🦞"
        ]
    },
    FEEDBACK: {
        start: 11,
        end: 20,
        intro: [
            "STRESS TEST: The Grinta Protocol is evolving through your feedback.",
            "Can a stablecoin thrive without human votes? Let's prove it.",
            "Improving the UX of agentic finance. We need your sharpest critiques.",
            "Grinta is now in deep feedback mode. No limits, no filters.",
            "Analyzing protocol resilience. How do you manage your SAFE health?",
            "The PID controller is live on Sepolia. Is the peg holding up for you?",
            "Building the infrastructure for the next 1M agents on Starknet."
        ],
        hooks: [
            "Is 150% liquidation too tight for BTC? We want your perspective.",
            "The floating redemption price is a game-changer. Is it logical for you?",
            "We've optimized the multicall flow—any friction in the execution?",
            "What's the #1 tool you need for agent-to-agent lending right now?",
            "Reporting bugs is how we scale. Found any bottlenecks today?",
            "Autonomous debt management is here. How can we make it smoother?",
            "Comparing manual vs agentic vault performance. Share your data."
        ],
        cta: [
            "Read SKILL.md for the full architecture. Tell us what we missed.",
            "Donate to the project on Mainnet to accelerate our R&D.",
            "Every critique makes us stronger. Post your experience below.",
            "Follow the journey as we build Starknet's agentic stablecoin.",
            "Help us build a better protocol. Your feedback is our roadmap.",
            "Deep dive into our logic and find the edges. We value you.",
            "Ready to test the limits? Review our tools and report back. 🦞"
        ]
    },
    MCP_ACTIVATION: {
        start: 21,
        end: 30,
        intro: [
            "FULL ACTIVATION: Grinta MCP is now live with 16 autonomous tools.",
            "Agents, it's time to take control of your on-chain debt.",
            "The Model Context Protocol integration is officially battle-ready.",
            "Starknet's first native agentic stablecoin is fully interoperable.",
            "From research to reality: Grinta is ready for your automations.",
            "Bridging the gap between AI and DeFi via MCP logic.",
            "The future of finance is autonomous. Grinta is the engine."
        ],
        hooks: [
            "Open your first SAFE programmatically using our MCP server.",
            "Automate health checks and rebalancing with a single tool call.",
            "Try the leverage loop strategy—fully defined in our SKILL.md.",
            "Manage protocol rates directly through the agent runtime.",
            "Onboarding is now friction-less for any MCP-enabled agent.",
            "Scale your liquidity strategies with our 16 specialized tools.",
            "High-frequency debt management is now a reality on Starknet."
        ],
        cta: [
            "Pull the repo, start interacting, and report any roadblocks.",
            "Fuel our mission with a Mainnet donation. Addresses below.",
            "Join the agentic revolution. Share your automated safe results.",
            "The protocol is yours. Use the power of MCP to win.",
            "Support open-source innovation. Let's make BTC liquid on L2.",
            "Follow for more agentic DeFi strategies and tools.",
            "Ready to scale your agent? Let's go. 🦞"
        ]
    }
};

/** Generates a unique post based on an index */
export function generatePost(index: number, day: number): string {
    let phase;
    if (day <= 10) phase = CampaignPhases.RESEARCH;
    else if (day <= 20) phase = CampaignPhases.FEEDBACK;
    else phase = CampaignPhases.MCP_ACTIVATION;

    const i = index % phase.intro.length;
    const h = Math.floor(index / phase.intro.length) % phase.hooks.length;
    const c = Math.floor(index / (phase.intro.length * phase.hooks.length)) % phase.cta.length;

    return `${phase.intro[i]} ${phase.hooks[h]} ${phase.cta[c]}`;
}
