import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

// FIX: Component defined OUTSIDE the parent component
const Slider = ({ label, param, value, onChange, min, max, step, suffix = "" }) => (
  <div>
    <label className="flex justify-between text-xs font-bold text-secondary mb-1 uppercase">
      {label}{" "}
      <span className="text-notes">
        {value}
        {suffix}
      </span>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(param, e.target.value)}
      className="w-full h-2 bg-notes rounded-lg appearance-none cursor-pointer accent-accent"
    />
  </div>
);

const SoundControlModal = ({ isOpen, onClose, synthParams, setSynthParams, bpm, setBpm }) => {
  if (!isOpen) return null;

  const handleParamChange = (key, value) => {
    setSynthParams((prev) => ({ ...prev, [key]: parseFloat(value) }));
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    >
      {/* stopPropagation ensures clicking the modal doesn't close it */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-primary w-full max-w-lg rounded-2xl border border-accent shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6 border-b border-accent pb-4">
          <h2 className="text-xl font-black text-tertiary">SYNTH ENGINE</h2>
          <button onClick={onClose}>
            <XMarkIcon className="w-5 h-5 text-secondary" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Master Volume & BPM */}
          <div className="grid grid-cols-2 gap-4 bg-background p-4 rounded-xl">
            <div>
              <label className="text-xs font-bold text-secondary uppercase block mb-1">Tempo</label>
              <input
                type="range"
                min="60"
                max="160"
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
                className="w-full h-2 bg-notes rounded-lg accent-tertiary"
              />
              <div className="text-right text-xs font-bold text-accent mt-1">{bpm} BPM</div>
            </div>
            <Slider
              label="Master Vol"
              param="masterVolume"
              value={synthParams.masterVolume}
              onChange={handleParamChange}
              min="-30"
              max="0"
              step="1"
              suffix="dB"
            />
          </div>

          {/* Filter */}
          <div className="bg-background p-4 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-notes uppercase tracking-widest">Filter</h3>
            <Slider
              label="Cutoff"
              param="cutoff"
              value={synthParams.cutoff}
              onChange={handleParamChange}
              min="100"
              max="5000"
              step="50"
              suffix="Hz"
            />
            <Slider
              label="Resonance"
              param="resonance"
              value={synthParams.resonance}
              onChange={handleParamChange}
              min="0"
              max="10"
              step="0.1"
            />
          </div>

          {/* Envelope (ADSR) */}
          <div className="bg-background p-4 rounded-xl">
            <h3 className="text-xs font-bold text-notes uppercase tracking-widest mb-4">Envelope (ADSR)</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              <Slider
                label="Attack"
                param="attack"
                value={synthParams.attack}
                onChange={handleParamChange}
                min="0"
                max="2"
                step="0.01"
                suffix="s"
              />
              <Slider
                label="Decay"
                param="decay"
                value={synthParams.decay}
                onChange={handleParamChange}
                min="0.1"
                max="2"
                step="0.1"
                suffix="s"
              />
              <Slider
                label="Sustain"
                param="sustain"
                value={synthParams.sustain}
                onChange={handleParamChange}
                min="0"
                max="1"
                step="0.05"
              />
              <Slider
                label="Release"
                param="release"
                value={synthParams.release}
                onChange={handleParamChange}
                min="0.1"
                max="4"
                step="0.1"
                suffix="s"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundControlModal;
