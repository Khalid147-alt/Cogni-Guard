import { create } from 'zustand';

export type Speaker = 'user' | 'other';

export interface TranscriptSegment {
    id: string;
    speaker: Speaker;
    text: string;
    isFallacy: boolean;
    timestamp: number;
}

export interface Fallacy {
    name: string;
    counterScript: string;
}

interface SessionState {
    isConnected: boolean;
    transcript: TranscriptSegment[];
    riskScore: number;
    activeFallacy: Fallacy | null;

    // Actions
    setIsConnected: (status: boolean) => void;
    addTranscriptSegment: (segment: Omit<TranscriptSegment, 'id' | 'timestamp'>) => void;
    updateRiskScore: (score: number) => void;
    triggerFallacy: (fallacy: Fallacy | null) => void;
    resetSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
    isConnected: false,
    transcript: [],
    riskScore: 0,
    activeFallacy: null,

    setIsConnected: (status) => set({ isConnected: status }),

    addTranscriptSegment: (segment) => set((state) => ({
        transcript: [
            ...state.transcript,
            {
                ...segment,
                id: Math.random().toString(36).substring(7),
                timestamp: Date.now(),
            },
        ],
    })),

    updateRiskScore: (score) => set({ riskScore: score }),

    triggerFallacy: (fallacy) => set({ activeFallacy: fallacy }),

    resetSession: () => set({
        isConnected: false,
        transcript: [],
        riskScore: 0,
        activeFallacy: null,
    }),
}));
