import { useState, useRef, useCallback, useEffect } from 'react';

interface AnalysisData {
    fallacy_detected: boolean;
    fallacy_name: string | null;
    counter_argument: string | null;
    risk_score: number | null;
}

interface TranscriptItem {
    id: string;
    text: string;
    isFinal: boolean;
    timestamp: number;
}

interface FallacyItem {
    id: string;
    text: string; // The sentence that triggered it
    analysis: AnalysisData;
    timestamp: number;
}

export function useAudioRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
    const [fallacies, setFallacies] = useState<FallacyItem[]>([]);
    const [riskScore, setRiskScore] = useState(0);
    const [isConnected, setIsConnected] = useState(false);

    const socketRef = useRef<WebSocket | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const connectWebSocket = useCallback(() => {
        if (socketRef.current?.readyState === WebSocket.OPEN) return;

        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/audio-stream';
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('WebSocket Connected');
            setIsConnected(true);
        };

        ws.onclose = () => {
            console.log('WebSocket Disconnected');
            setIsConnected(false);
            setIsRecording(false);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'transcript') {
                setTranscript(prev => {
                    // Simple append for now, could be smarter about updating partials
                    const newItem = {
                        id: Date.now().toString() + Math.random(),
                        text: data.text,
                        isFinal: true, // Deepgram sends finals in this setup
                        timestamp: Date.now()
                    };
                    return [...prev, newItem];
                });
            } else if (data.type === 'analysis') {
                const analysis: AnalysisData = data.data;
                if (analysis.fallacy_detected) {
                    setFallacies(prev => [{
                        id: Date.now().toString() + Math.random(),
                        text: data.text,
                        analysis: analysis,
                        timestamp: Date.now()
                    }, ...prev]); // Newest first
                }
                if (analysis.risk_score !== null) {
                    setRiskScore(analysis.risk_score);
                }
            }
        };

        socketRef.current = ws;
    }, []);

    const startRecording = useCallback(async () => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            connectWebSocket();
            // Wait a bit for connection? Or just fail?
            // For simplicity, we assume connection is fast or already established
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0 && socketRef.current?.readyState === WebSocket.OPEN) {
                    socketRef.current.send(event.data);
                }
            };

            mediaRecorder.start(250); // Send chunks every 250ms
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    }, [connectWebSocket]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
        setIsRecording(false);
    }, []);

    // Initial connection
    useEffect(() => {
        connectWebSocket();
        return () => {
            socketRef.current?.close();
        };
    }, [connectWebSocket]);

    return {
        isRecording,
        isConnected,
        startRecording,
        stopRecording,
        transcript,
        fallacies,
        riskScore
    };
}
