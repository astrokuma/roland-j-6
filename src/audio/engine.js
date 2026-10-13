import * as Tone from "tone";
import { arpSequence, buildTimeline, eventAt, STEP_LENGTHS } from "./timeline";

// Per-voice gain. Four full-scale sawtooth voices sum to roughly +12 dB, so each voice is
// pulled down far enough that a full chord peaks near 0 dBFS before the master volume.
const VOICE_VOLUME_DB = -14;
const PREVIEW_SECONDS = 1.2;

// Juno-60 style chorus modes (I and II), which the J-6 engine is modelled on.
export const CHORUS_MODES = [
  { id: 0, label: "Off" },
  { id: 1, label: "I", frequency: 0.5, depth: 0.5, delayTime: 3.5 },
  { id: 2, label: "II", frequency: 0.83, depth: 0.7, delayTime: 3 },
];

export const WAVEFORMS = [
  { id: "sawtooth", label: "Saw" },
  { id: "fatsawtooth", label: "Fat Saw" },
  { id: "square", label: "Square" },
  { id: "pulse", label: "Pulse" },
  { id: "triangle", label: "Triangle" },
];

export const DEFAULT_SOUND = {
  waveform: "sawtooth",
  cutoff: 2200,
  resonance: 1.5,
  attack: 0.02,
  decay: 0.4,
  sustain: 0.6,
  release: 0.8,
  chorus: 1,
  delayLevel: 0.15,
  delayTime: 0.33,
  reverbLevel: 0.25,
  reverbTime: 2.5,
  masterVolume: -6,
};

export const SOUND_PRESETS = [
  { name: "Juno Pad", sound: { ...DEFAULT_SOUND, attack: 0.25, release: 1.6, cutoff: 1800, chorus: 2, reverbLevel: 0.35 } },
  { name: "Poly Keys", sound: { ...DEFAULT_SOUND } },
  { name: "Brass", sound: { ...DEFAULT_SOUND, waveform: "fatsawtooth", attack: 0.06, decay: 0.3, sustain: 0.7, release: 0.4, cutoff: 3000, resonance: 0.8, chorus: 1, delayLevel: 0.05, reverbLevel: 0.15 } },
  { name: "Pluck", sound: { ...DEFAULT_SOUND, waveform: "pulse", attack: 0.005, decay: 0.25, sustain: 0.05, release: 0.4, cutoff: 3500, resonance: 3, chorus: 1, delayLevel: 0.3, delayTime: 0.375 } },
  { name: "Glass", sound: { ...DEFAULT_SOUND, waveform: "triangle", attack: 0.01, decay: 0.8, sustain: 0.3, release: 1.4, cutoff: 5000, resonance: 0.5, chorus: 2, reverbLevel: 0.4, reverbTime: 3.5 } },
];

export const PLAY_MODES = [
  { id: "pad", label: "PAD", title: "Hold each chord for its full length" },
  { id: "rhythm", label: "RHY", title: "Play chords on the rhythm grid" },
  { id: "arp", label: "ARP", title: "Arpeggiate chords" },
];

export const DEFAULT_SEQUENCE = {
  mode: "pad",
  pattern: [true, true, true, true],
  gate: 0.5,
  arpDirection: "up",
  arpOctaves: 1,
  arpRate: "16n",
  stepLength: "1m",
};

const ARP_RATE_TICKS = { "4n": 4, "8n": 2, "16n": 1 };

const toNoteNames = (midis) => midis.map((m) => Tone.Frequency(m, "midi").toNote());

class AudioEngine {
  constructor() {
    this.sound = { ...DEFAULT_SOUND };
    this.sequence = { ...DEFAULT_SEQUENCE };
    this.bpm = 110;
    this.steps = [];
    this.timeline = buildTimeline([], STEP_LENGTHS["1m"]);
    this.position = 0;
    this.playing = false;
    this.currentStep = null;
    this.scheduledStep = null;
    this.arpCache = null;
    this.listeners = new Set();
    this.nodes = null;
    this.reverbTimer = null;
  }

  // Audio nodes are created on the first user gesture so the browser doesn't block the context.
  ensureNodes() {
    if (this.nodes) return this.nodes;
    Tone.getContext().lookAhead = 0.05;

    const limiter = new Tone.Limiter(-1).toDestination();
    const master = new Tone.Volume(this.sound.masterVolume).connect(limiter);
    const reverb = new Tone.Reverb({ decay: this.sound.reverbTime, preDelay: 0.01, wet: this.sound.reverbLevel }).connect(master);
    const delay = new Tone.FeedbackDelay({ delayTime: this.sound.delayTime, feedback: 0.35, wet: this.sound.delayLevel }).connect(reverb);
    const chorus = new Tone.Chorus({ frequency: 0.5, delayTime: 3.5, depth: 0.5, spread: 180, wet: 0 }).connect(delay).start();
    const filter = new Tone.Filter({ type: "lowpass", rolloff: -24, frequency: this.sound.cutoff, Q: this.sound.resonance }).connect(chorus);

    // Sequencer and previews get separate voices, so a preview never cuts off a sequenced note.
    const makeSynth = () => new Tone.PolySynth(Tone.Synth, { maxPolyphony: 24, volume: VOICE_VOLUME_DB }).connect(filter);
    const synth = makeSynth();
    const previewSynth = makeSynth();

    const loop = new Tone.Loop((time) => this.tick(time), "16n").start(0);

    this.nodes = { limiter, master, reverb, delay, chorus, filter, synth, previewSynth, loop };
    this.applySound(this.sound, true);
    Tone.getTransport().bpm.value = this.bpm;
    return this.nodes;
  }

  async unlock() {
    if (Tone.getContext().state !== "running") await Tone.start();
    return this.ensureNodes();
  }

  applySound(sound, initial = false) {
    const previous = this.sound;
    this.sound = { ...sound };
    if (!this.nodes) return;
    const { synth, previewSynth, filter, chorus, delay, reverb, master } = this.nodes;

    const oscillator = sound.waveform === "fatsawtooth" ? { type: "fatsawtooth", count: 3, spread: 18 } : sound.waveform === "pulse" ? { type: "pulse", width: 0.3 } : { type: sound.waveform };
    const voice = { oscillator, envelope: { attack: sound.attack, decay: sound.decay, sustain: sound.sustain, release: sound.release } };
    if (initial || previous.waveform !== sound.waveform) {
      synth.set(voice);
      previewSynth.set(voice);
    } else {
      synth.set({ envelope: voice.envelope });
      previewSynth.set({ envelope: voice.envelope });
    }

    filter.frequency.rampTo(sound.cutoff, 0.05);
    filter.Q.rampTo(sound.resonance, 0.05);

    const chorusMode = CHORUS_MODES.find((c) => c.id === sound.chorus) ?? CHORUS_MODES[0];
    chorus.wet.rampTo(chorusMode.id ? 0.5 : 0, 0.05);
    if (chorusMode.id) {
      chorus.frequency.value = chorusMode.frequency;
      chorus.depth = chorusMode.depth;
      chorus.delayTime = chorusMode.delayTime;
    }

    delay.wet.rampTo(sound.delayLevel, 0.05);
    delay.delayTime.rampTo(sound.delayTime, 0.1);
    reverb.wet.rampTo(sound.reverbLevel, 0.05);
    master.volume.rampTo(sound.masterVolume, 0.05);

    // Changing reverb time regenerates the impulse response, so wait until the slider settles.
    if (initial || previous.reverbTime !== sound.reverbTime) {
      clearTimeout(this.reverbTimer);
      this.reverbTimer = setTimeout(() => {
        reverb.decay = sound.reverbTime;
      }, 250);
    }
  }

  setSequence(sequence) {
    const stepLengthChanged = sequence.stepLength !== this.sequence.stepLength;
    this.sequence = { ...sequence };
    this.arpCache = null;
    if (stepLengthChanged) this.setSteps(this.steps);
  }

  setBpm(bpm) {
    this.bpm = Number(bpm);
    if (this.nodes) Tone.getTransport().bpm.rampTo(this.bpm, 0.05);
  }

  /** steps: [{type: "chord", midis}, {type: "hold"}, {type: "rest"}] */
  setSteps(steps) {
    this.steps = steps;
    this.timeline = buildTimeline(
      steps.map((s) => (s.type === "chord" ? { type: "chord", notes: s.midis } : s)),
      STEP_LENGTHS[this.sequence.stepLength] ?? 16,
    );
    this.arpCache = null;
  }

  async preview(midis) {
    const { previewSynth } = await this.unlock();
    const now = Tone.immediate();
    previewSynth.releaseAll(now);
    previewSynth.triggerAttackRelease(toNoteNames(midis), PREVIEW_SECONDS, now, 0.8);
  }

  async start() {
    await this.unlock();
    if (this.playing) return;
    this.position = 0;
    this.scheduledStep = null;
    this.arpCache = null;
    Tone.getTransport().start("+0.05");
    this.playing = true;
    this.emit();
  }

  stop() {
    if (!this.nodes) return;
    const transport = Tone.getTransport();
    transport.stop();
    this.nodes.synth.releaseAll();
    this.playing = false;
    this.currentStep = null;
    this.emit();
  }

  tick(time) {
    const { total, stepTicks } = this.timeline;
    if (!total) return;
    const position = this.position % total;
    this.position++;

    const step = Math.floor(position / stepTicks);
    if (step !== this.scheduledStep) {
      this.scheduledStep = step;
      Tone.getDraw().schedule(() => {
        if (!this.playing) return;
        this.currentStep = step;
        this.emit();
      }, time);
    }

    const event = eventAt(this.timeline, position);
    if (!event?.notes?.length) return;

    const { mode, pattern, gate, arpDirection, arpOctaves, arpRate } = this.sequence;
    const sixteenth = Tone.Time("16n").toSeconds();
    const offset = position - event.start;
    const { synth } = this.nodes;

    if (mode === "pad") {
      if (offset === 0) synth.triggerAttackRelease(toNoteNames(event.notes), event.length * sixteenth * 0.98, time, 0.75);
      return;
    }

    const beatActive = pattern[Math.floor((position % 16) / 4)];
    if (!beatActive) return;

    if (mode === "rhythm") {
      if (position % 4 === 0) synth.triggerAttackRelease(toNoteNames(event.notes), 4 * sixteenth * gate, time, 0.75);
      return;
    }

    const rate = ARP_RATE_TICKS[arpRate] ?? 1;
    if (offset % rate !== 0) return;
    const cacheKey = `${event.start}|${arpDirection}|${arpOctaves}`;
    if (this.arpCache?.key !== cacheKey) this.arpCache = { key: cacheKey, notes: toNoteNames(arpSequence(event.notes, arpDirection, arpOctaves)) };
    const notes = this.arpCache.notes;
    synth.triggerAttackRelease(notes[Math.floor(offset / rate) % notes.length], rate * sixteenth * gate, time, 0.7);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit() {
    const state = { playing: this.playing, step: this.playing ? this.currentStep : null };
    this.listeners.forEach((listener) => listener(state));
  }
}

// One engine for the whole app. Creating more than one doubles every note.
export const engine = new AudioEngine();
