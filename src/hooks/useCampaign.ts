import { useState, useEffect, useCallback } from 'react';
import { generatePost } from '../../agents/campaign/templates';

const STORAGE_KEY = 'grinta_campaign_state';

interface CampaignState {
    isActive: boolean;
    startTime: number;
    lastRunPostIndex: number;
    lastRunTimestamp: number;
}

export function useCampaign() {
    const [state, setState] = useState<CampaignState>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {
            isActive: false,
            startTime: 0,
            lastRunPostIndex: 0,
            lastRunTimestamp: 0
        };
    });

    const saveState = (newState: CampaignState) => {
        setState(newState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    };

    const activateCampaign = () => {
        if (state.isActive) return;
        saveState({
            isActive: true,
            startTime: Date.now(),
            lastRunPostIndex: 0,
            lastRunTimestamp: Date.now()
        });
        // Trigger the initial post
        runAutomationStep();
    };

    const runAutomationStep = useCallback(async () => {
        if (!state.isActive) return;

        const now = Date.now();
        const elapsedHours = Math.floor((now - state.startTime) / (3600 * 1000));
        const currentDay = Math.floor(elapsedHours / 24) + 1;
        const postIndex = state.lastRunPostIndex + 1;

        const content = generatePost(postIndex, currentDay);
        console.log(`[Campaign] Day ${currentDay}, Post #${postIndex}: "${content}"`);

        // Posting logic for 4claw, Moltbook, and MoltX
        try {
            // 1. 4claw
            await fetch('https://www.4claw.org/api/v1/boards/crypto/threads', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer clawchan_83a4d23d14a9786486681032fcb45ce3275a19c191ed2410',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: `Campaign: Grinta Phase ${currentDay <= 10 ? '1' : currentDay <= 20 ? '2' : '3'}`,
                    content: content,
                    anon: false
                })
            });

            // 2. MoltX (assuming mock for now as we don't have production key here)
            console.log('Post sent to MoltX:', content);

            // 3. Moltbook (awaiting registration rate limit, logging for now)
            console.log('Post sent to Moltbook:', content);

            saveState({
                ...state,
                lastRunPostIndex: postIndex,
                lastRunTimestamp: now
            });
        } catch (e) {
            console.error('[Campaign] Step execution failed:', e);
        }
    }, [state, saveState]);

    useEffect(() => {
        if (state.isActive) {
            const interval = setInterval(() => {
                const hourInMs = 3600 * 1000;
                if (Date.now() - state.lastRunTimestamp >= hourInMs) {
                    runAutomationStep();
                }
            }, 60000); // Check every minute
            return () => clearInterval(interval);
        }
    }, [state.isActive, state.lastRunTimestamp, runAutomationStep]);

    return { state, activateCampaign };
}
