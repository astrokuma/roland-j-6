import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BANKS, getChord } from "../data/banks";
import { transposeChord } from "../utils/chordTheory";
import { buildShareUrl, MAX_STEPS, readUrlState } from "../utils/share";
import usePersistentState from "./usePersistentState";

let nextId = 1;
const withId = (step) => ({ ...step, id: nextId++ });

// A link someone shared wins over whatever this browser had saved.
const urlState = readUrlState(BANKS.length);

/**
 * The chord set being browsed, the global transpose (J-6 KEY) and the step sequence.
 * Steps mirror the J-6 sequencer: up to 64 steps, each a chord, a HOLD (tie) or a rest.
 */
const useProgression = () => {
  const [bank, setBank] = usePersistentState("j6.bank", 1, urlState.bank);
  const [transpose, setTranspose] = usePersistentState("j6.transpose", 0, urlState.transpose);
  const [storedSteps, setStoredSteps] = usePersistentState("j6.steps", [], urlState.steps);
  const [recording, setRecording] = usePersistentState("j6.recording", true);
  const [steps, setStepsState] = useState(() => storedSteps.filter((s) => s.type !== "chord" || getChord(s.bank, s.key)).map(withId));
  const stepsRef = useRef(steps);

  const setSteps = useCallback((update) => {
    setStepsState((previous) => {
      const next = typeof update === "function" ? update(previous) : update;
      stepsRef.current = next;
      return next;
    });
  }, []);

  useEffect(() => {
    setStoredSteps(steps.map((step) => ({ type: step.type, ...(step.type === "chord" && { bank: step.bank, key: step.key }) })));
  }, [steps, setStoredSteps]);

  // Keep the address bar shareable without adding history entries.
  useEffect(() => {
    const url = buildShareUrl({ bank, transpose, steps });
    window.history.replaceState(null, "", url);
  }, [bank, transpose, steps]);

  const changeBank = useCallback((number) => setBank(((number - 1 + BANKS.length) % BANKS.length) + 1), [setBank]);
  const stepBank = useCallback((delta) => setBank((current) => ((current - 1 + delta + BANKS.length) % BANKS.length) + 1), [setBank]);

  const append = useCallback(
    (step) => {
      if (stepsRef.current.length >= MAX_STEPS) return false;
      setSteps((previous) => [...previous, withId(step)]);
      return true;
    },
    [setSteps],
  );

  const addChord = useCallback((chordBank, key) => append({ type: "chord", bank: chordBank, key }), [append]);
  const addHold = useCallback(() => stepsRef.current.length > 0 && append({ type: "hold" }), [append]);
  const addRest = useCallback(() => append({ type: "rest" }), [append]);
  const undo = useCallback(() => setSteps((previous) => previous.slice(0, -1)), [setSteps]);
  const clear = useCallback(() => setSteps([]), [setSteps]);
  const removeStep = useCallback((index) => setSteps((previous) => previous.filter((_, i) => i !== index)), [setSteps]);
  const moveStep = useCallback(
    (index, delta) =>
      setSteps((previous) => {
        const target = index + delta;
        if (target < 0 || target >= previous.length) return previous;
        const next = [...previous];
        [next[index], next[target]] = [next[target], next[index]];
        return next;
      }),
    [setSteps],
  );

  const resolveChord = useCallback((chordBank, key) => transposeChord(getChord(chordBank, key), transpose), [transpose]);

  const currentBank = useMemo(
    () => ({ ...BANKS[bank - 1], chords: BANKS[bank - 1].chords.map((chord) => transposeChord(chord, transpose)) }),
    [bank, transpose],
  );

  // Unique chords used in the sequence, transposed, in first-use order.
  const progressionChords = useMemo(() => {
    const seen = new Set();
    return steps
      .filter((s) => s.type === "chord")
      .filter((s) => {
        const id = `${s.bank}-${s.key}`;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      })
      .map((s) => resolveChord(s.bank, s.key));
  }, [steps, resolveChord]);

  return {
    bank,
    currentBank,
    changeBank,
    stepBank,
    transpose,
    setTranspose,
    steps,
    recording,
    setRecording,
    addChord,
    addHold,
    addRest,
    undo,
    clear,
    removeStep,
    moveStep,
    resolveChord,
    progressionChords,
  };
};

export default useProgression;
