import JSConfetti from "js-confetti";
import { useCallback, useEffect, useRef } from "react";
import * as Tone from "tone";
import applauseSound from "../assets/sounds/applause.wav";
import mistakeSound from "../assets/sounds/mixkit-losing-bleeps-2026.wav";

const audioMistake = new Audio(mistakeSound);
const audioApplause = new Audio(applauseSound);

let confetti;

function playAudio(audio) {
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

export const playMistake = () => playAudio(audioMistake);

// Applause and star confetti at the end of a song or text.
export function celebrate() {
  confetti ??= new JSConfetti();
  confetti.addConfetti({ emojis: ["⭐"], emojiSize: 20, confettiNumber: 100 });
  playAudio(audioApplause);
}

// Returns playNote(pitch, duration) backed by a synth that lives as long as the component.
export function useSynth() {
  const synth = useRef(null);

  useEffect(() => {
    synth.current = new Tone.Synth().toDestination();
    return () => synth.current.dispose();
  }, []);

  const lastTime = useRef(0);

  return useCallback((pitch, duration = "8n") => {
    if (!synth.current) return;
    Tone.start();
    // A monophonic synth throws if two notes start at the same time,
    // which happens when keys are pressed faster than the audio clock ticks.
    const time = Math.max(Tone.now(), lastTime.current + 0.01);
    lastTime.current = time;
    try {
      synth.current.triggerAttackRelease(pitch, duration, time);
    } catch (error) {
      console.error(error);
    }
  }, []);
}
