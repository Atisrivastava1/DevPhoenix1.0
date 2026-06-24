"use client";

import { useCallback, useRef, useState, useEffect } from "react";

export function useSoundEffects() {
  const audioCtx = useRef<AudioContext | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioCtx.current = new AudioContext();
      }
    }
    return () => {
      if (audioCtx.current?.state !== "closed") {
        audioCtx.current?.close().catch(() => {});
      }
    };
  }, []);

  const playChime = useCallback((basePitch = 440) => {
    if (!isEnabled || !audioCtx.current) return;
    
    // Attempt to resume context if suspended (browser autoplay policy)
    if (audioCtx.current.state === "suspended") {
      audioCtx.current.resume().catch(() => {});
    }

    try {
      const osc = audioCtx.current.createOscillator();
      const gainNode = audioCtx.current.createGain();

      // Futuristic sine wave chime
      osc.type = "sine";
      osc.frequency.setValueAtTime(basePitch, audioCtx.current.currentTime);
      osc.frequency.exponentialRampToValueAtTime(basePitch * 1.5, audioCtx.current.currentTime + 0.1);

      // ADSR Envelope
      gainNode.gain.setValueAtTime(0, audioCtx.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.current.currentTime + 0.05); // Attack
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.5); // Decay/Release

      osc.connect(gainNode);
      gainNode.connect(audioCtx.current.destination);

      osc.start();
      osc.stop(audioCtx.current.currentTime + 0.6);
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  }, [isEnabled]);

  const toggleSound = useCallback(() => {
    setIsEnabled(prev => {
      const next = !prev;
      if (next && audioCtx.current?.state === "suspended") {
        audioCtx.current.resume().catch(() => {});
      }
      return next;
    });
  }, []);

  return { isEnabled, playChime, toggleSound };
}
