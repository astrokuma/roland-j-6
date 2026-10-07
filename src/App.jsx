import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Note } from "@tonaljs/tonal";
import Header from "./components/Header";
import Footer from "./components/Footer";
import KeyboardDisplay from "./components/KeyboardDisplay";
import StepStrip from "./components/StepStrip";
import CardDisplay from "./components/CardDisplay";
import ScaleSection from "./components/ScaleSection";
import TransportDeck from "./components/TransportDeck";
import SoundControlModal from "./components/SoundControlModal";
import SequenceModal from "./components/SequenceModal";
import SettingsModal from "./components/SettingsModal";
import BankBrowser from "./components/BankBrowser";
import useProgression from "./hooks/useProgression";
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";
import { useAudio } from "./audio/AudioProvider";
import { buildShareUrl } from "./utils/share";

const toMidis = (chord) => chord.notes.map((n) => Note.midi(n));

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    if (navigator.share) {
      try {
        await navigator.share({ title: "J-6 chord sequence", url: text });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
};

const App = () => {
  const progression = useProgression();
  const audio = useAudio();
  const [modal, setModal] = useState(null);
  const [litKey, setLitKey] = useState(null);
  const [focusScale, setFocusScale] = useState(null);
  const litTimer = useRef(null);

  const { steps, bank, currentBank, recording, resolveChord, addChord } = progression;
  const { preview, setSteps, isPlaying, playingStep, start, stop } = audio;

  // Hand the sequencer resolved notes whenever the steps or transpose change. It picks them up live.
  useEffect(() => {
    setSteps(steps.map((s) => (s.type === "chord" ? { type: "chord", midis: toMidis(resolveChord(s.bank, s.key)) } : { type: s.type })));
  }, [steps, resolveChord, setSteps]);

  // Clearing the sequence while it plays stops playback instead of leaving it running.
  useEffect(() => {
    if (isPlaying && !steps.length) stop();
  }, [isPlaying, steps.length, stop]);

  useEffect(() => {
    if (!steps.length) setFocusScale(null);
  }, [steps.length]);

  const flashKey = useCallback((key) => {
    setLitKey(key);
    clearTimeout(litTimer.current);
    litTimer.current = setTimeout(() => setLitKey(null), 350);
  }, []);

  // Pressing a key works like the J-6: it always sounds, and records a step while REC is on.
  const pressKey = useCallback(
    (key) => {
      const chord = currentBank.chords[key - 1];
      preview(toMidis(chord));
      flashKey(key);
      if (recording) addChord(bank, key);
    },
    [currentBank, preview, flashKey, recording, addChord, bank],
  );

  const playToggle = useCallback(() => {
    if (isPlaying) stop();
    else if (steps.length) start();
  }, [isPlaying, steps.length, start, stop]);

  // Map key -> step numbers for the chord set on screen.
  const stepsByKey = useMemo(() => {
    const map = {};
    steps.forEach((s, index) => {
      if (s.type === "chord" && s.bank === bank) (map[s.key] ??= []).push(index + 1);
    });
    return map;
  }, [steps, bank]);

  // A HOLD step keeps the previous chord sounding, so light that chord's key.
  const playingKey = useMemo(() => {
    if (playingStep === null) return null;
    for (let i = playingStep; i >= 0; i--) {
      const step = steps[i];
      if (!step || step.type === "rest") return null;
      if (step.type === "chord") return step.bank === bank ? step.key : null;
    }
    return null;
  }, [playingStep, steps, bank]);

  useKeyboardShortcuts(
    {
      onPianoKey: pressKey,
      onBank: progression.stepBank,
      onTranspose: (delta) => progression.setTranspose((t) => Math.max(-12, Math.min(12, t + delta))),
      onPlayToggle: playToggle,
      onUndo: progression.undo,
    },
    modal === null,
  );

  const share = () => copyText(buildShareUrl({ bank, transpose: progression.transpose, steps }));
  const closeModal = useCallback(() => setModal(null), []);

  return (
    <div className="min-h-dvh flex flex-col bg-background pb-28">
      <Header
        bank={bank}
        changeBank={progression.changeBank}
        stepBank={progression.stepBank}
        transpose={progression.transpose}
        setTranspose={progression.setTranspose}
        onOpenBrowser={() => setModal("browser")}
        onOpenSettings={() => setModal("settings")}
      />

      {/* Phones: only the step strip sticks, to save height. Larger screens: keys and steps stick together. */}
      <div className="max-md:contents md:sticky md:top-0 md:z-30 md:bg-background md:py-2">
        <div className="w-full max-w-7xl mx-auto px-2 md:grid md:grid-cols-[auto_1fr] md:gap-2 max-md:contents">
          <div className="max-md:px-2 max-md:pt-2 max-md:w-full">
            <KeyboardDisplay
              chords={currentBank.chords}
              stepsByKey={stepsByKey}
              playingKey={playingKey}
              litKey={litKey}
              onKeyPress={pressKey}
            />
          </div>
          <div className="max-md:sticky max-md:top-0 max-md:z-30 max-md:bg-background max-md:px-2 max-md:py-2 min-w-0">
            <StepStrip
              steps={steps}
              resolveChord={resolveChord}
              playingStep={playingStep}
              recording={recording}
              setRecording={progression.setRecording}
              onHold={progression.addHold}
              onRest={progression.addRest}
              onUndo={progression.undo}
              onClear={progression.clear}
              onRemove={progression.removeStep}
              onMove={progression.moveStep}
              onStepPress={(step) => preview(toMidis(resolveChord(step.bank, step.key)))}
            />
          </div>
        </div>
      </div>

      <main className="flex-1">
        <CardDisplay
          bank={currentBank}
          stepsByKey={stepsByKey}
          playingKey={playingKey}
          litKey={litKey}
          recording={recording}
          focusScale={focusScale}
          onClearFocus={() => setFocusScale(null)}
          onPress={pressKey}
          onSwipe={progression.stepBank}
        />
        <ScaleSection
          chords={progression.progressionChords}
          focusScale={focusScale}
          onFocusScale={(scale) => {
            setFocusScale(scale);
            if (scale) window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </main>

      <Footer />

      <TransportDeck
        isPlaying={isPlaying}
        canPlay={steps.length > 0}
        onPlayToggle={playToggle}
        mode={audio.sequence.mode}
        onModeChange={(mode) => audio.setSequence((prev) => ({ ...prev, mode }))}
        bpm={audio.bpm}
        onOpenSequence={() => setModal("sequence")}
        onOpenSound={() => setModal("sound")}
        onShare={share}
      />

      <SoundControlModal
        isOpen={modal === "sound"}
        onClose={closeModal}
        sound={audio.sound}
        setSound={audio.setSound}
      />
      <SequenceModal
        isOpen={modal === "sequence"}
        onClose={closeModal}
        sequence={audio.sequence}
        setSequence={audio.setSequence}
        bpm={audio.bpm}
        setBpm={audio.setBpm}
      />
      <SettingsModal
        isOpen={modal === "settings"}
        onClose={closeModal}
      />
      <BankBrowser
        isOpen={modal === "browser"}
        onClose={closeModal}
        currentBank={bank}
        onSelect={progression.changeBank}
      />
    </div>
  );
};

export default App;
