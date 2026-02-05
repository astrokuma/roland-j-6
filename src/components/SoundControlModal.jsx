import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

const SoundControlModal = ({ isOpen, onClose, synthParams, setSynthParams, bpm, setBpm }) => {
  if (!isOpen) return null;

  const handleParamChange = (key, value) => {
    setSynthParams((prev) => ({ ...prev, [key]: parseFloat(value) }));
  };

  return (
    // 1. Add onClick={onClose} to the backdrop
    <div
      onClick={onClose}
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
    >
      {/* 2. Add e.stopPropagation() so clicks inside don't close the modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-primary w-full max-w-md rounded-2xl border border-accent/20 shadow-2xl p-6 animate-in slide-in-from-bottom-10 fade-in duration-200"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-accent/10 pb-4">
          <h2 className="text-xl font-black text-tertiary tracking-tight">SYNTH ENGINE</h2>
          <button
            onClick={onClose}
            className="bg-accent/10 p-1 rounded-full hover:bg-accent/20 text-secondary"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* BPM */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-bold text-secondary uppercase">Tempo</label>
              <span className="text-xs font-bold text-accent">{bpm} BPM</span>
            </div>
            <input
              type="range"
              min="60"
              max="160"
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
              className="w-full h-2 bg-notes rounded-lg appearance-none cursor-pointer accent-tertiary"
            />
          </div>

          {/* Filter Section */}
          <div className="bg-background/50 p-4 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-notes uppercase tracking-widest">Low Pass Filter</h3>

            <div>
              <label className="flex justify-between text-xs font-bold text-secondary mb-1">
                Cutoff <span>{Math.round(synthParams.cutoff)}Hz</span>
              </label>
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={synthParams.cutoff}
                onChange={(e) => handleParamChange("cutoff", e.target.value)}
                className="w-full h-2 bg-notes rounded-lg appearance-none cursor-pointer accent-secondary"
              />
            </div>

            <div>
              <label className="flex justify-between text-xs font-bold text-secondary mb-1">
                Resonance <span>{synthParams.resonance}</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={synthParams.resonance}
                onChange={(e) => handleParamChange("resonance", e.target.value)}
                className="w-full h-2 bg-notes rounded-lg appearance-none cursor-pointer accent-secondary"
              />
            </div>
          </div>

          {/* Envelope Section */}
          <div className="bg-background/50 p-4 rounded-xl">
            <h3 className="text-xs font-bold text-notes uppercase tracking-widest mb-4">Envelope</h3>
            <div className="grid grid-cols-2 gap-4">
              {["attack", "release"].map((param) => (
                <div key={param}>
                  <label className="text-xs font-bold text-secondary uppercase block mb-1">{param}</label>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={synthParams[param]}
                    onChange={(e) => handleParamChange(param, e.target.value)}
                    className="w-full h-2 bg-notes rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoundControlModal;
