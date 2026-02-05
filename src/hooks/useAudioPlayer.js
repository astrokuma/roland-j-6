import { useEffect, useRef, useState, useCallback } from "react";
import * as Tone from "tone";

const useAudioPlayer = () => {
  const synth = useRef(null);
  const filter = useRef(null);
  const limiter = useRef(null);
  const volume = useRef(null);
  const sequence = useRef(null);

  const currentChordsRef = useRef([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(110);

  // -- STATE --
  const [playMode, setPlayMode] = useState("chord");
  const [arpSettings, setArpSettings] = useState({
    type: "up",
    octaves: 1,
    pattern: [true, true, true, true],
    subdivision: "8n",
    gate: 0.5,
  });

  // -- REFS (The secret to Realtime changes) --
  // We mirror state in refs so the sequencer can read the *latest* values
  // without needing to restart the loop.
  const playModeRef = useRef(playMode);
  const arpSettingsRef = useRef(arpSettings);

  useEffect(() => {
    playModeRef.current = playMode;
  }, [playMode]);
  useEffect(() => {
    arpSettingsRef.current = arpSettings;
  }, [arpSettings]);

  const [synthParams, setSynthParams] = useState({
    waveform: "sawtooth",
    attack: 0.05,
    decay: 0.2,
    sustain: 0.3,
    release: 1.0,
    cutoff: 2500,
    resonance: 2,
    masterVolume: -6,
  });

  // 1. Initialize Audio Engine
  useEffect(() => {
    limiter.current = new Tone.Limiter(-1).toDestination();
    volume.current = new Tone.Volume(synthParams.masterVolume).connect(limiter.current);
    filter.current = new Tone.Filter(synthParams.cutoff, "lowpass", -24).connect(volume.current);
    filter.current.Q.value = synthParams.resonance;

    synth.current = new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 16,
      oscillator: { type: synthParams.waveform },
      envelope: {
        attack: synthParams.attack,
        decay: synthParams.decay,
        sustain: synthParams.sustain,
        release: synthParams.release,
      },
    }).connect(filter.current);

    return () => {
      synth.current?.dispose();
      filter.current?.dispose();
      volume.current?.dispose();
      limiter.current?.dispose();
      sequence.current?.dispose();
    };
  }, []);

  // 2. Sync Params
  useEffect(() => {
    if (synth.current && filter.current && volume.current) {
      synth.current.set({
        oscillator: { type: synthParams.waveform },
        envelope: {
          attack: synthParams.attack,
          decay: synthParams.decay,
          sustain: synthParams.sustain,
          release: synthParams.release,
        },
      });
      filter.current.frequency.rampTo(synthParams.cutoff, 0.1);
      filter.current.Q.rampTo(synthParams.resonance, 0.1);
      volume.current.volume.rampTo(synthParams.masterVolume, 0.1);
    }
  }, [synthParams]);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  const getArpNotes = useCallback((notes, type, octaves) => {
    let pool = [...notes];
    if (octaves > 1) {
      const upper = notes.map((n) => Tone.Frequency(n).transpose(12).toNote());
      pool = [...pool, ...upper];
    }
    const sorted = pool.sort((a, b) => Tone.Frequency(a).toMidi() - Tone.Frequency(b).toMidi());

    if (type === "down") return sorted.reverse();
    if (type === "upDown") return [...sorted, ...[...sorted].reverse().slice(1, -1)];
    if (type === "random") return sorted.sort(() => Math.random() - 0.5);
    return sorted;
  }, []);

  // 3. Sequencer Logic
  const startSequencer = useCallback(
    (chords) => {
      // If we are already playing and just changing chords, update the ref and return
      // (This keeps the beat locked)
      const wasPlaying = Tone.Transport.state === "started";
      currentChordsRef.current = chords;

      // Only create a new sequence if one doesn't exist
      if (sequence.current) {
        if (!wasPlaying) {
          Tone.Transport.start();
          setIsPlaying(true);
        }
        return;
      }

      let stepIndex = 0;

      sequence.current = new Tone.Sequence(
        (time, _) => {
          // READ FROM REFS (Realtime)
          const currentMode = playModeRef.current;
          const currentSettings = arpSettingsRef.current;

          const stepsPerChord = 16;
          const totalSteps = currentChordsRef.current.length * stepsPerChord;
          const currentStep = stepIndex % totalSteps;
          const chordIndex = Math.floor(currentStep / stepsPerChord);
          const activeChord = currentChordsRef.current[chordIndex];

          if (!activeChord) return;

          const patternStep = Math.floor((currentStep % 16) / 4);
          const isStepActive = currentSettings.pattern[patternStep];

          // Use settings from Ref
          const duration = Tone.Time("4n").toSeconds() * currentSettings.gate;

          if (isStepActive) {
            if (currentMode === "chord") {
              if (currentStep % 4 === 0) {
                synth.current.triggerAttackRelease(activeChord.notes, duration, time);
              }
            } else {
              const notes = getArpNotes(activeChord.notes, currentSettings.type, currentSettings.octaves);
              const arpNoteIndex = currentStep % notes.length;

              const arpDuration = Tone.Time("8n").toSeconds() * currentSettings.gate;
              synth.current.triggerAttackRelease(notes[arpNoteIndex], arpDuration, time);
            }
          }
          stepIndex++;
        },
        [0],
        "16n",
      ).start(0);

      Tone.Transport.start();
      setIsPlaying(true);
    },
    [getArpNotes],
  );

  // NOTE: Removed the "Hot Swap" useEffect entirely.
  // The Refs handle the updates automatically inside the loop.

  const playChord = (notes) => {
    if (Tone.context.state !== "running") Tone.start();
    synth.current.triggerAttackRelease(notes, "2n");
  };

  const stopSequence = useCallback(() => {
    Tone.Transport.stop();
    // We do NOT dispose the sequence here if we want to resume,
    // but for a true "Stop", disposing is safer to reset state.
    if (sequence.current) {
      sequence.current.dispose();
      sequence.current = null;
    }
    setIsPlaying(false);
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
