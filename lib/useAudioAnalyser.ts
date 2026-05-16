"use client";

import { useRef, useState, useCallback } from "react";

export type AudioMode = "idle" | "listening" | "responding";

export interface AudioAnalyserHandle {
  mode: AudioMode;
  analyser: AnalyserNode | null;
  startListening: () => Promise<void>;
  stop: () => void;
  /** Plug in an AI TTS <audio> element to visualise the response */
  connectAudioElement: (el: HTMLAudioElement) => void;
}

export function useAudioAnalyser(): AudioAnalyserHandle {
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [mode, setMode] = useState<AudioMode>("idle");
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const buildAnalyser = (ctx: AudioContext): AnalyserNode => {
    const node = ctx.createAnalyser();
    node.fftSize = 512;
    node.smoothingTimeConstant = 0.65; // snappier response to voice
    analyserRef.current = node;
    return node;
  };

  const startListening = useCallback(async () => {
    try {
      // Resume or create AudioContext (browsers require user gesture)
      if (!ctxRef.current) {
        ctxRef.current = new AudioContext();
      }
      if (ctxRef.current.state === "suspended") {
        await ctxRef.current.resume();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const node = buildAnalyser(ctxRef.current);
      const source = ctxRef.current.createMediaStreamSource(stream);
      source.connect(node);
      // Note: intentionally NOT connecting analyser → destination (no mic playback)

      setAnalyser(node);
      setMode("listening");
    } catch {
      // User denied mic or browser unsupported — stay idle
    }
  }, []);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    analyserRef.current = null;
    setAnalyser(null);
    setMode("idle");
    // Keep AudioContext alive for potential reconnect
  }, []);

  const connectAudioElement = useCallback((el: HTMLAudioElement) => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;
    const node = buildAnalyser(ctx);
    const source = ctx.createMediaElementSource(el);
    source.connect(node);
    node.connect(ctx.destination); // AI audio must reach speakers
    setAnalyser(node);
    setMode("responding");
  }, []);

  return { mode, analyser, startListening, stop, connectAudioElement };
}
