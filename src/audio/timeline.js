// Step lengths in 16th notes. The J-6 sequencer is step-based; here a step can be a bar, half bar or beat.
export const STEP_LENGTHS = { "1m": 16, "2n": 8, "4n": 4 };

/**
 * Turn resolved steps ({type: "chord", notes} | {type: "hold"} | {type: "rest"}) into timed events.
 * HOLD extends whatever came before it (like the J-6 [HOLD] tie), so a chord can last several steps.
 */
export const buildTimeline = (steps, stepTicks) => {
  const events = [];
  steps.forEach((step, index) => {
    const start = index * stepTicks;
    const previous = events[events.length - 1];
    if (step.type === "hold" && previous) {
      previous.length += stepTicks;
      return;
    }
    events.push({ start, length: stepTicks, step: index, notes: step.type === "chord" ? step.notes : null });
  });
  return { events, total: steps.length * stepTicks, stepTicks };
};

export const eventAt = (timeline, position) => timeline.events.find((e) => position >= e.start && position < e.start + e.length) ?? null;

const shuffle = (list) => {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/** Build the arpeggio note order (as MIDI numbers) for a chord. */
export const arpSequence = (midis, direction, octaves) => {
  const base = [...midis].sort((a, b) => a - b);
  const pool = [];
  for (let octave = 0; octave < octaves; octave++) pool.push(...base.map((m) => m + 12 * octave));
  if (direction === "down") return pool.reverse();
  if (direction === "upDown") return pool.length > 2 ? [...pool, ...pool.slice(1, -1).reverse()] : pool;
  if (direction === "random") return shuffle(pool);
  return pool;
};
