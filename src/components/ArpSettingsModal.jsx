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
    { id: "up", icon: <ArrowUpIcon className="w-5 h-5" /> },
    { id: "down", icon: <ArrowDownIcon className="w-5 h-5" /> },
    { id: "upDown", icon: <ArrowsUpDownIcon className="w-5 h-5" /> },
    { id: "random", icon: <QuestionMarkCircleIcon className="w-5 h-5" /> },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    >
      {/* FIXED BG */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-primary w-full max-w-sm rounded-2xl border-2 border-accent shadow-2xl p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-tertiary">SEQUENCE CONFIG</h2>
          <button onClick={onClose}>
            <XMarkIcon className="w-6 text-secondary" />
          </button>
        </div>

        <div className="mb-6">
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
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-1">
            <label className="text-xs font-bold text-secondary uppercase">Gate / Length</label>
            <span className="text-xs font-bold text-accent">{Math.round(arpSettings.gate * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.5"
            step="0.1"
            value={arpSettings.gate}
            onChange={(e) => setArpSettings((prev) => ({ ...prev, gate: parseFloat(e.target.value) }))}
            className="w-full h-2 bg-notes rounded-lg appearance-none cursor-pointer accent-tertiary"
          />
          <div className="flex justify-between text-[10px] text-notes font-bold mt-1 uppercase">
            <span>Stab</span>
            <span>Hold</span>
            <span>Drone</span>
          </div>
        </div>

        <div className={`space-y-4 transition-opacity ${playMode === "chord" ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
          {/* FIXED BG: Removed bg-background/30 */}
          <div className="bg-background p-3 rounded-lg">
            <label className="text-xs font-bold text-secondary uppercase mb-2 block">Arp Direction</label>
            <div className="flex gap-1">
              {directions.map((dir) => (
                <button
                  key={dir.id}
                  onClick={() => setArpSettings((prev) => ({ ...prev, type: dir.id }))}
                  className={`flex-1 py-2 rounded-md flex justify-center items-center
                    ${arpSettings.type === dir.id ? "bg-tertiary text-primary" : "text-notes bg-primary"}`}
                >
                  {dir.icon}
                </button>
              ))}
            </div>
          </div>

          {/* FIXED BG */}
          <div className="bg-background p-3 rounded-lg">
            <label className="text-xs font-bold text-secondary uppercase mb-2 block">Range</label>
            <div className="flex gap-1">
              {[1, 2, 3].map((oct) => (
                <button
                  key={oct}
                  onClick={() => setArpSettings((prev) => ({ ...prev, octaves: oct }))}
                  className={`flex-1 py-1 font-bold rounded-md
                    ${arpSettings.octaves === oct ? "bg-tertiary text-primary" : "text-notes bg-primary"}`}
                >
                  {oct} Oct
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArpSettingsModal;
