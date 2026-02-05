import React from "react";
import { XMarkIcon, ArrowUpIcon, ArrowDownIcon, ArrowsUpDownIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

const ArpSettingsModal = ({ isOpen, onClose, arpSettings, setArpSettings, playMode }) => {
  if (!isOpen) return null;

  const togglePatternStep = (index) => {
    const newPattern = [...arpSettings.pattern];
    newPattern[index] = !newPattern[index];
    setArpSettings((prev) => ({ ...prev, pattern: newPattern }));
  };

  const directions = [
    { id: "up", icon: <ArrowUpIcon className="w-5 h-5" />, label: "Up" },
    { id: "down", icon: <ArrowDownIcon className="w-5 h-5" />, label: "Down" },
    { id: "upDown", icon: <ArrowsUpDownIcon className="w-5 h-5" />, label: "Up/Down" },
    { id: "random", icon: <QuestionMarkCircleIcon className="w-5 h-5" />, label: "Rand" },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-primary w-full max-w-sm rounded-2xl border-2 border-accent shadow-2xl p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-tertiary">PATTERN CONFIG</h2>
          <button onClick={onClose}>
            <XMarkIcon className="w-6 text-secondary" />
          </button>
        </div>

        {/* 1. Rhythmic Pattern Grid (Works for both Chords and Arps) */}
        <div className="mb-8">
          <label className="text-xs font-bold text-secondary uppercase mb-2 block">Rhythm Grid (1 Bar)</label>
          <div className="grid grid-cols-4 gap-2">
            {arpSettings.pattern.map((isActive, i) => (
              <button
                key={i}
                onClick={() => togglePatternStep(i)}
                className={`h-12 rounded-md font-bold text-lg transition-all border-2
                  ${isActive ? "bg-accent border-accent text-primary" : "bg-transparent border-notes text-notes"}`}
              >
                {isActive ? "HIT" : "-"}
              </button>
            ))}
          </div>
          <p className="text-xs text-notes mt-2 text-center">Click to toggle beats on/off</p>
        </div>

        {/* 2. Arp Specific Settings (Only show if in Arp Mode) */}
        <div className={`space-y-6 transition-opacity ${playMode === "chord" ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
          {/* Direction */}
          <div>
            <label className="text-xs font-bold text-secondary uppercase mb-2 block">Arp Direction</label>
            <div className="flex bg-background rounded-lg p-1 gap-1">
              {directions.map((dir) => (
                <button
                  key={dir.id}
                  onClick={() => setArpSettings((prev) => ({ ...prev, type: dir.id }))}
                  className={`flex-1 py-2 rounded-md flex justify-center items-center
                    ${arpSettings.type === dir.id ? "bg-tertiary text-primary" : "text-notes hover:bg-accent/10"}`}
                >
                  {dir.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Octaves */}
          <div>
            <label className="text-xs font-bold text-secondary uppercase mb-2 block">Octave Range</label>
            <div className="flex bg-background rounded-lg p-1 gap-1">
              {[1, 2, 3].map((oct) => (
                <button
                  key={oct}
                  onClick={() => setArpSettings((prev) => ({ ...prev, octaves: oct }))}
                  className={`flex-1 py-1 font-bold rounded-md
                    ${arpSettings.octaves === oct ? "bg-tertiary text-primary" : "text-notes hover:bg-accent/10"}`}
                >
                  {oct}
                </button>
              ))}
            </div>
          </div>
        </div>

        {playMode === "chord" && <div className="mt-4 text-center text-xs text-tertiary font-bold">* Switch to Arp Mode to enable Direction/Octave controls</div>}
      </div>
    </div>
  );
};

export default ArpSettingsModal;
