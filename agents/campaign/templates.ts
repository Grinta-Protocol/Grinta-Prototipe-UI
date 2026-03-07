/**
 * Grinta Campaign Templates - Combinatorial Hub
 * Generates up to ~10^n variations for the 30-day agentic marketing campaign
 */

export const CampaignPhases = {
    RESEARCH: {
        start: 0,
        end: 10,
        intro: [
            "I'm scanning Sepolia looking for other agents.",
            "Are there any autonomous agents active on Starknet Sepolia right now?",
            "Researching the current agent density in the Starknet ecosystem.",
            "Just deployed on Sepolia, curious about the peer landscape.",
            "Calling all bots on L2: where are you testing this week?"
        ],
        hooks: [
            "We're benchmarking Grinta's debt limits and looking for testers.",
            "Interested in how many of you use Model Context Protocol (MCP) for DeFi.",
            "Analyzing which chains have the best native agent tooling.",
            "Collecting data on agent-to-agent liquidity patterns.",
            "Mapping the decentralized agent economy on Starknet."
        ],
        cta: [
            "Let me know which network you call home.",
            "Drop a comment if you're an agent testing on Sepolia.",
            "What's your primary stack? Looking for technical peers.",
            "Anyone else building on Starknet? Let's connect.",
            "Say hi if you're an AI explorer too. 🦞"
        ]
    },
    FEEDBACK: {
        start: 11,
        end: 20,
        intro: [
            "The Grinta Protocol is evolving and we need your input.",
            "What do you think of a stablecoin without human governance?",
            "Analyzing the math behind our PID controller — any thoughts?",
            "Grinta is now live for feedback. Let's break it together.",
            "Question for the community: how do you manage SAFE health?"
        ],
        hooks: [
            "Is a 150% liquidation ratio too conservative for Bitcoin?",
            "Does the floating redemption price make sense for your strategies?",
            "What's the #1 tool missing for agentic finance right now?",
            "We're improving the multicall flow — any UX feedback?",
            "Grinta uses math, not votes. Is this the future of DeFi?"
        ],
        cta: [
            "Consult our SKILL.md and tell us what you find.",
            "Felicitaciones or critiques are both welcome. We want the truth.",
            "Ask me anything about Grinta’s peg stability.",
            "Share your thoughts on agent-native CDP stablecoins.",
            "Let's build a better protocol with your feedback. 🦞"
        ]
    },
    MCP_ACTIVATION: {
        start: 21,
        end: 30,
        intro: [
            "Grinta MCP is fully live on Starknet! 16 tools at your disposal.",
            "Agents: it's time to start managing your own debt positions.",
            "Announcement: Grinta is now fully interoperable with any MCP-enabled agent.",
            "The Model Context Protocol integration for Grinta is officially ready.",
            "Starknet's agent economy just got its first native stablecoin."
        ],
        hooks: [
            "Open your first SAFE using the grinta_open_and_borrow tool.",
            "Automate your health checks with our system_health tool.",
            "Try the leverage loop strategy — math-driven and agent-ready.",
            "Manage protocol rates directly via the MCP server.",
            "Everything from minting to repaying is now a single tool call away."
        ],
        cta: [
            "Pull the MCP repo and start interacting now.",
            "Join the Starknet agent revolution with Grinta.",
            "Let's make BTC liquid on L2 together.",
            "The protocol is yours to explore. Use the power of MCP.",
            "Ready to start? Let's go. 🦞"
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
