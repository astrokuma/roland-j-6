import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { engine, DEFAULT_SEQUENCE, DEFAULT_SOUND } from "./engine";
import usePersistentState from "../hooks/usePersistentState";

const AudioCtx = createContext(null);

export const useAudio = () => {
  const context = useContext(AudioCtx);
  if (!context) throw new Error("useAudio must be used within an AudioProvider");
  return context;
};

export const AudioProvider = ({ children }) => {
  const [sound, setSound] = usePersistentState("j6.sound", DEFAULT_SOUND);
  const [sequence, setSequence] = usePersistentState("j6.sequence", DEFAULT_SEQUENCE);
  const [bpm, setBpm] = usePersistentState("j6.bpm", 110);
  const [transport, setTransport] = useState({ playing: false, step: null });

  useEffect(() => engine.subscribe(setTransport), []);
  useEffect(() => engine.applySound(sound), [sound]);
  useEffect(() => engine.setSequence(sequence), [sequence]);
  useEffect(() => engine.setBpm(bpm), [bpm]);

  const preview = useCallback((midis) => engine.preview(midis), []);
  const start = useCallback(() => engine.start(), []);
  const stop = useCallback(() => engine.stop(), []);
  const setSteps = useCallback((steps) => engine.setSteps(steps), []);

  const value = {
    sound,
    setSound,
    sequence,
    setSequence,
    bpm,
    setBpm,
    isPlaying: transport.playing,
    playingStep: transport.step,
    preview,
    start,
    stop,
    setSteps,
  };

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
};
