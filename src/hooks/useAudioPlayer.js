import { useEffect, useRef, useState, useCallback } from "react";
import * as Tone from "tone";

const useAudioPlayer = () => {
  const synth = useRef(null);
  const filter = useRef(null);
  const sequence = useRef(null);

  // We need a ref to hold the current chords so the effect can access them
  // without needing them passed in as an argument
  const currentChordsRef = useRef([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(110);
  const [playMode, setPlayMode] = useState("chord");

  const [arpSettings, setArpSettings] = useState({
    type: "up",
    octaves: 1,
    pattern: [true, true, true, true],
    subdivision: "8n",
  });

  const [synthParams, setSynthParams] = useState({
    waveform: "sawtooth",
    attack: 0.05,
    decay: 0.2,
    sustain: 0.4,
    release: 1.5,
    cutoff: 2000,
    resonance: 1,
    volume: -8,
  });

  // 1. Initialize Audio Engine
  useEffect(() => {
    filter.current = new Tone.Filter(synthParams.cutoff, "lowpass", -24).toDestination();
    filter.current.Q.value = synthParams.resonance;

    synth.current = new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 32, // High polyphony prevents voice stealing/clicking
      oscillator: { type: synthParams.waveform },
      envelope: {
        attack: synthParams.attack,
        decay: synthParams.decay,
        sustain: synthParams.sustain,
        release: synthParams.release,
      },
      volume: synthParams.volume,
    }).connect(filter.current);

    return () => {
      synth.current?.dispose();
      filter.current?.dispose();
      sequence.current?.dispose();
    };
  }, []);

  // 2. Sync Params
  useEffect(() => {
    if (synth.current && filter.current) {
      synth.current.set({
        oscillator: { type: synthParams.waveform },
        envelope: {
          attack: synthParams.attack,
          decay: synthParams.decay,
          sustain: synthParams.sustain,
          release: synthParams.release,
        },
        volume: synthParams.volume,
      });
      filter.current.frequency.rampTo(synthParams.cutoff, 0.1);
      filter.current.Q.rampTo(synthParams.resonance, 0.1);
    }
  }, [synthParams]);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  // 3. Arp Note Logic
  const getArpNotes = useCallback((notes, type, octaves) => {
    let pool = [...notes];
    if (octaves > 1) {
      const upper = notes.map((n) => Tone.Frequency(n).transpose(12).toNote());
      pool = [...pool, ...upper];
    }

    // Simple sort by pitch
    const sorted = pool.sort((a, b) => Tone.Frequency(a).toMidi() - Tone.Frequency(b).toMidi());

    if (type === "down") return sorted.reverse();
    if (type === "upDown") return [...sorted, ...[...sorted].reverse().slice(1, -1)];
    if (type === "random") return sorted.sort(() => Math.random() - 0.5);
    return sorted;
  }, []);

  // 4. The Sequencer
  const startSequencer = useCallback(
    (chords) => {
      // Update ref so hot-swap knows what to play
      currentChordsRef.current = chords;

      // Dispose old sequence to prevent overlap
      if (sequence.current) sequence.current.dispose();

      let stepIndex = 0; // Local variable, resets every time we start

      sequence.current = new Tone.Sequence(
        (time, _) => {
          // Logic: 1 Bar (16 steps) per chord
          const stepsPerChord = 16;
          const totalSteps = currentChordsRef.current.length * stepsPerChord;
          const currentStep = stepIndex % totalSteps;
          const chordIndex = Math.floor(currentStep / stepsPerChord);
          const activeChord = currentChordsRef.current[chordIndex];

          if (!activeChord) return;

          // Pattern Gate: map 16 steps to 4 beat pattern
          const patternStep = Math.floor((currentStep % 16) / 4);
          const isStepActive = arpSettings.pattern[patternStep];

          if (isStepActive) {
            if (playMode === "chord") {
              // Play Chord on the downbeat of the pattern block
              if (currentStep % 4 === 0) {
                synth.current.triggerAttackRelease(activeChord.notes, "4n", time);
              }
            } else {
              // Play Arp
              const notes = getArpNotes(activeChord.notes, arpSettings.type, arpSettings.octaves);
              const arpNoteIndex = currentStep % notes.length;
              synth.current.triggerAttackRelease(notes[arpNoteIndex], "8n", time);
            }
          }

          stepIndex++;
        },
        [0],
        "16n",
      ).start(0);

      if (Tone.Transport.state !== "started") {
        Tone.Transport.start();
      }
      setIsPlaying(true);
    },
    [playMode, arpSettings, getArpNotes],
  );

  // 5. Hot-Swap Effect
  // If settings change while playing, restart the sequencer instantly
  useEffect(() => {
    if (isPlaying && currentChordsRef.current.length > 0) {
      startSequencer(currentChordsRef.current);
    }
    // We purposefully exclude 'isPlaying' from deps to avoid double-trigger on start
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playMode, arpSettings, startSequencer]);

  const playChord = (notes) => {
    if (Tone.context.state !== "running") Tone.start();
    synth.current.triggerAttackRelease(notes, "2n");
  };

  const stopSequence = useCallback(() => {
    Tone.Transport.stop();
    if (sequence.current) {
      sequence.current.dispose();
      sequence.current = null;
    }
    setIsPlaying(false);
    // REMOVED: stepIndex = 0; (This caused the crash)
  }, []);

  return {
    playChord,
    startSequencer,
    stopSequence,
    isPlaying,
    synthParams,
    setSynthParams,
    bpm,
    setBpm,
    playMode,
    setPlayMode,
    arpSettings,
    setArpSettings,
  };
};

export default useAudioPlayer;
