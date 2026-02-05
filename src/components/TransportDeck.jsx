import React from "react";
import { PlayIcon, StopIcon, SparklesIcon, AdjustmentsHorizontalIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";

const TransportDeck = ({ isPlaying, onPlayToggle, playMode, setPlayMode, onOpenSoundSettings, onOpenArpSettings, hasChords }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4">
      <div className="bg-primary/95 backdrop-blur-xl border border-accent shadow-2xl rounded-2xl p-2 flex items-center justify-between gap-2">
        {/* Play/Stop */}
        <button
          onClick={onPlayToggle}
          disabled={!hasChords}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-lg transition-all
            ${hasChords ? (isPlaying ? "bg-secondary text-primary" : "bg-accent text-primary hover:brightness-110") : "bg-gray-800 text-gray-500 cursor-not-allowed"}`}
        >
          {isPlaying ? <StopIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
          <span className="hidden sm:inline">{isPlaying ? "STOP" : "PLAY"}</span>
        </button>

        <div className="w-px h-8 bg-accent"></div>

        {/* Mode Toggle Group */}
        <div className="flex bg-background rounded-xl p-1 gap-1">
          {/* Arp Toggle */}
          <button
            onClick={() => setPlayMode(playMode === "arp" ? "chord" : "arp")}
            className={`p-3 rounded-lg transition-all border-2
              ${playMode === "arp" ? "bg-tertiary border-tertiary text-primary" : "border-transparent text-tertiary hover:bg-accent hover:text-primary"}`}
            title="Toggle Arpeggiator"
          >
            <SparklesIcon className="w-5 h-5" />
          </button>

          {/* Arp/Pattern Settings (Gear) */}
          <button
            onClick={onOpenArpSettings}
            className="p-3 rounded-lg hover:bg-accent text-secondary transition-all"
            title="Pattern Settings"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="w-px h-8 bg-accent"></div>

        {/* Global Sound Settings */}
        <div className="flex bg-background rounded-xl p-1 gap-1">
          <button
            onClick={onOpenSoundSettings}
            className="p-3 rounded-xl hover:bg-accent text-notes transition-all"
            title="Synth Settings"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransportDeck;
