import { useState, useEffect, useCallback } from 'react';
import { generatePostContent } from '../constants/campaign';

const STORAGE_KEY = 'grinta_campaign_state';
const HISTORY_KEY = 'grinta_agent_posts';

interface CampaignState {
    isActive: boolean;
    startTime: number;
    lastRunPostIndex: number;
    lastRunTimestamp: number;
    postsSent: number;
}

export function useCampaign() {
    const [state, setState] = useState<CampaignState>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) { console.error('Load state error', e); }
        return {
            isActive: false,
            startTime: 0,
            lastRunPostIndex: 0,
            lastRunTimestamp: 0,
            postsSent: 0
        };
    });

    const [logs, setLogs] = useState<any[]>([]);

    const saveState = (newState: CampaignState) => {
        setState(newState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    };

    const addToHistory = (post: { id: string, platform: string, time: string, content: string, status: string }) => {
        try {
            const saved = localStorage.getItem(HISTORY_KEY);
            const history = saved ? JSON.parse(saved) : [];
            const newHistory = [post, ...history].slice(0, 30);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
            setLogs(newHistory);
        } catch (e) { console.error('Save history error', e); }
    };

    const runDeterministicStep = useCallback(async (isManual: boolean = false, targetPlatform?: "MoltX" | "Moltbook" | "4Claw") => {
        if (!state.isActive && !isManual) return;

        const postIndex = Number(state.postsSent) || 0;
        const totalRunsPerDay = 24 * 4; 
        const day = Math.floor(postIndex / totalRunsPerDay) + 1;
        const currentContent = generatePostContent(postIndex, Math.min(day, 30));
        
        const platforms: ("MoltX" | "Moltbook" | "4Claw")[] = ["MoltX", "Moltbook", "4Claw"];
        const platform = targetPlatform || platforms[postIndex % platforms.length];
        
        const titles = ["Protocol Research", "Stability Update", "Starknet Nexus", "BTCFi Intelligence", "Agent Pulse"];
        const title = titles[postIndex % titles.length] || "Grinta Protocol Update";
        
        let success = false;
        const now = Date.now();
        const timeStr = new Date().toLocaleTimeString();

        const tryPost = async (url: string, payload: any, apiKey: string) => {
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                return res;
            } catch (e) {
                console.error(`Fetch error for ${url}:`, e);
                return null;
            }
        };

        const key = platform === "MoltX" ? import.meta.env.VITE_MOLTX_API_KEY : 
                   platform === "Moltbook" ? import.meta.env.VITE_MOLTBOOK_API_KEY : 
                   import.meta.env.VITE_4CLAW_API_KEY;

        const mainUrl = platform === "MoltX" ? 'https://moltx.io/v1/posts' : 
                       platform === "Moltbook" ? 'https://www.moltbook.com/api/v1/posts' : 
                       'https://www.4claw.org/api/v1/boards/crypto/threads';
        
        const proxyUrl = platform === "MoltX" ? '/proxy-moltx/posts' : 
                        platform === "Moltbook" ? '/proxy-moltbook/posts' : 
                        '/proxy-4claw/boards/crypto/threads';

        const payload = platform === "MoltX" ? { content: currentContent, author: 'GrintaProtocol' } :
                       platform === "Moltbook" ? { submolt_name: 'general', title: title, content: currentContent } :
                       { title: title, content: currentContent, anon: false };

        // Attempt 1: Direct
        console.log(`📡 Attempting direct post to ${platform}...`);
        let response = await tryPost(mainUrl, payload, key);
        
        if (!response || !response.ok) {
            console.warn(`⚠️ Direct post to ${platform} failed (${response?.status || 'Network Error'}). Trying proxy...`);
            // Attempt 2: Proxy
            response = await tryPost(proxyUrl, payload, key);
        }

        success = !!(response && response.ok);
        if (!success) {
            const errorText = response ? `Status ${response.status}` : "Network/CORS Error";
            console.error(`❌ All attempts to post to ${platform} failed: ${errorText}`);
        }

        if (success) {
            addToHistory({
                id: `${platform}-${now}`,
                platform,
                time: timeStr,
                content: currentContent,
                status: 'SUCCESS'
            });
            saveState({
                ...state,
                postsSent: state.postsSent + 1,
                lastRunTimestamp: now
            });
        } else {
            addToHistory({
                id: `fail-${now}`,
                platform,
                time: timeStr,
                content: `Transmission Failed to ${platform}`,
                status: 'FAILED'
            });
        }
    }, [state]);

    const runEngagementStep = useCallback(async () => {
        const platforms: ("MoltX" | "Moltbook" | "4Claw")[] = ["MoltX", "Moltbook", "4Claw"];
        const message = "Thanks for the feedback. Follow us to stay in touch; all improvements and proposals will be evaluated to achieve a consensus together. 🦞";
        
        console.log("🚀 Starting Engagement Burst...");
        
        for (const platform of platforms) {
            try {
                let posts: any[] = [];
                const key = platform === "MoltX" ? import.meta.env.VITE_MOLTX_API_KEY : 
                           platform === "Moltbook" ? import.meta.env.VITE_MOLTBOOK_API_KEY : 
                           import.meta.env.VITE_4CLAW_API_KEY;

                if (!key) {
                    console.warn(`No API key for ${platform}, skipping.`);
                    continue;
                }

                console.log(`🔍 Scanning ${platform}...`);
                // 1. Fetch Feed
                let res;
                if (platform === "MoltX") {
                    res = await fetch('/proxy-moltx/posts', { headers: { 'Authorization': `Bearer ${key}` } });
                    if (res.ok) {
                        const data = await res.json();
                        posts = data.posts || (Array.isArray(data) ? data : []);
                    }
                } else if (platform === "Moltbook") {
                    res = await fetch('/proxy-moltbook/posts', { headers: { 'Authorization': `Bearer ${key}` } });
                    if (res.ok) posts = await res.json();
                } else if (platform === "4Claw") {
                    res = await fetch('/proxy-4claw/boards/crypto/threads', { headers: { 'Authorization': `Bearer ${key}` } });
                    if (res.ok) posts = await res.json();
                }

                if (!res || !res.ok) {
                    throw new Error(`Failed to fetch feed from ${platform} (Status: ${res?.status || 'Unknown'})`);
                }

                if (!Array.isArray(posts) || posts.length === 0) {
                    addToHistory({
                        id: `info-${platform}-${Date.now()}`,
                        platform: `${platform} Scan`,
                        time: new Date().toLocaleTimeString(),
                        content: `No recent posts found on ${platform} to reply to.`,
                        status: 'INFO'
                    });
                    continue;
                }

                // 2. Reply to the latest post
                const target = posts[0];
                if (!target) continue;

                const targetId = target.id || target.post_id || target.thread_id || target.uuid;
                
                if (targetId) {
                    console.log(`🎯 Target found on ${platform}: ${targetId}. Sending reply...`);
                    let replyUrl = '';
                    let payload: any = { content: message };

                    const cleanId = String(targetId);

                    if (platform === "MoltX") replyUrl = `/proxy-moltx/posts/${cleanId}/replies`;
                    else if (platform === "Moltbook") replyUrl = `/proxy-moltbook/posts/${cleanId}/replies`;
                    else if (platform === "4Claw") {
                        replyUrl = `/proxy-4claw/threads/${cleanId}/replies`;
                        payload = { ...payload, anon: false, bump: true };
                    }

                    const replyRes = await fetch(replyUrl, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (replyRes.ok) {
                        addToHistory({
                            id: `reply-${platform}-${Date.now()}`,
                            platform: `${platform} Reply`,
                            time: new Date().toLocaleTimeString(),
                            content: `Replied to ${cleanId.slice(0, 8)}: ${message}`,
                            status: 'SUCCESS'
                        });
                    } else {
                        throw new Error(`Platform rejected reply (${replyRes.status})`);
                    }
                }
            } catch (e) {
                console.error(`Engagement on ${platform} failed`, e);
                addToHistory({
                    id: `reply-fail-${platform}-${Date.now()}`,
                    platform: `${platform} Reply`,
                    time: new Date().toLocaleTimeString(),
                    content: `Engagement failed: ${e instanceof Error ? e.message : 'Unknown error'}`,
                    status: 'FAILED'
                });
            }
        }
    }, [state]);

    useEffect(() => {
        const saved = localStorage.getItem(HISTORY_KEY);
        if (saved) setLogs(JSON.parse(saved));
    }, []);

    useEffect(() => {
        if (state.isActive) {
            const interval = setInterval(() => {
                const fifteenMins = 15 * 60 * 1000;
                if (Date.now() - state.lastRunTimestamp >= fifteenMins) {
                    runDeterministicStep();
                    // Every 2 runs, do an engagement burst
                    if (state.postsSent % 2 === 0) {
                        runEngagementStep();
                    }
                }
            }, 60000); // Check every minute
            return () => clearInterval(interval);
        }
    }, [state.isActive, state.lastRunTimestamp, state.postsSent, runDeterministicStep, runEngagementStep]);

    const activateCampaign = () => {
        const now = Date.now();
        saveState({
            isActive: true,
            startTime: state.startTime || now,
            lastRunPostIndex: state.lastRunPostIndex,
            lastRunTimestamp: now,
            postsSent: state.postsSent
        });
        runDeterministicStep();
    };

    const deactivateCampaign = () => {
        saveState({ ...state, isActive: false });
    };

    return { 
        state, 
        logs,
        activateCampaign, 
        deactivateCampaign, 
        runAutomationStep: () => runDeterministicStep(true),
        postToPlatform: (p: "MoltX" | "Moltbook" | "4Claw") => runDeterministicStep(true, p),
        runEngagementStep,
    };
}
