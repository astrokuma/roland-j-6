import React from "react";
import Modal from "./Modal";
import { Panel, Segmented, Slider } from "./controls";
import { CHORUS_MODES, DEFAULT_SOUND, SOUND_PRESETS, WAVEFORMS } from "../audio/engine";

const seconds = (v) => (v < 1 ? `${Math.round(v * 1000)} ms` : `${v.toFixed(1)} s`);
const percent = (v) => `${Math.round(v * 100)}%`;
const hertz = (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)} kHz` : `${v} Hz`);

const SoundControlModal = ({ isOpen, onClose, sound, setSound }) => {
  const set = (key) => (value) => setSound((prev) => ({ ...prev, [key]: value }));
  const activePreset = SOUND_PRESETS.find((p) => Object.keys(p.sound).every((k) => p.sound[k] === sound[k]))?.name;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sound"
    >
      <div className="space-y-4">
        <Panel title="Presets">
          <Segmented
            label="Preset"
            options={SOUND_PRESETS.map((p) => ({ id: p.name, label: p.name }))}
            value={activePreset}
            onChange={(name) => setSound({ ...SOUND_PRESETS.find((p) => p.name === name).sound, masterVolume: sound.masterVolume })}
          />
        </Panel>

        <Panel>
          <Slider
            label="Volume"
            value={sound.masterVolume}
            onChange={set("masterVolume")}
            min={-40}
            max={0}
            step={1}
            format={(v) => `${v} dB`}
          />
          <div>
            <p className="text-xs font-bold text-secondary uppercase mb-1">Waveform</p>
            <Segmented
              label="Waveform"
              options={WAVEFORMS}
              value={sound.waveform}
              onChange={set("waveform")}
            />
          </div>
        </Panel>

        <Panel title="Filter">
          <Slider
            label="Cutoff"
            value={sound.cutoff}
            onChange={set("cutoff")}
            min={100}
            max={8000}
            step={50}
            format={hertz}
          />
          <Slider
            label="Resonance"
            value={sound.resonance}
            onChange={set("resonance")}
            min={0}
            max={10}
            step={0.1}
          />
        </Panel>

        <Panel title="Envelope">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <Slider
              label="Attack"
              value={sound.attack}
              onChange={set("attack")}
              min={0.005}
              max={2}
              step={0.005}
              format={seconds}
            />
            <Slider
              label="Decay"
              value={sound.decay}
              onChange={set("decay")}
              min={0.05}
              max={2}
              step={0.05}
              format={seconds}
            />
            <Slider
              label="Sustain"
              value={sound.sustain}
              onChange={set("sustain")}
              min={0}
              max={1}
              step={0.05}
              format={percent}
            />
            <Slider
              label="Release"
              value={sound.release}
              onChange={set("release")}
              min={0.05}
              max={4}
              step={0.05}
              format={seconds}
            />
          </div>
        </Panel>

        <Panel title="Chorus">
          <Segmented
            label="Chorus"
            options={CHORUS_MODES}
            value={sound.chorus}
            onChange={set("chorus")}
          />
        </Panel>

        <div className="grid sm:grid-cols-2 gap-4">
          <Panel title="Delay">
            <Slider
              label="Level"
              value={sound.delayLevel}
              onChange={set("delayLevel")}
              min={0}
              max={0.8}
              step={0.01}
              format={percent}
            />
            <Slider
              label="Time"
              value={sound.delayTime}
              onChange={set("delayTime")}
              min={0.05}
              max={1}
              step={0.01}
              format={seconds}
            />
          </Panel>
          <Panel title="Reverb">
            <Slider
              label="Level"
              value={sound.reverbLevel}
              onChange={set("reverbLevel")}
              min={0}
              max={0.8}
              step={0.01}
              format={percent}
            />
            <Slider
              label="Time"
              value={sound.reverbTime}
              onChange={set("reverbTime")}
              min={0.3}
              max={8}
              step={0.1}
              format={seconds}
            />
          </Panel>
        </div>

        <button
          onClick={() => setSound({ ...DEFAULT_SOUND })}
          className="w-full py-2 rounded-xl bg-notes text-accent text-sm font-black hover:bg-accent hover:text-primary"
        >
          Reset sound
        </button>
      </div>
    </Modal>
  );
};

export default SoundControlModal;
