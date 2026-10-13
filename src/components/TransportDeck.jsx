import React, { useEffect, useState } from "react";
import { AdjustmentsHorizontalIcon, CheckIcon, LinkIcon, PlayIcon, QueueListIcon, StopIcon } from "@heroicons/react/24/solid";
import { PLAY_MODES } from "../audio/engine";

const DeckButton = ({ onClick, label, children }) => (
  <button
    onClick={onClick}
    title={label}
    aria-label={label}
    className="w-11 h-11 shrink-0 rounded-xl text-accent hover:bg-notes flex items-center justify-center"
  >
    {children}
  </button>
);

const TransportDeck = ({ isPlaying, canPlay, onPlayToggle, mode, onModeChange, bpm, onOpenSequence, onOpenSound, onShare }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  const share = async () => {
    if (await onShare()) setCopied(true);
  };

  return (
    <div className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-2 sm:px-4">
      <div className="bg-primary border border-accent/60 shadow-2xl shadow-black/50 rounded-2xl p-1.5 flex items-center gap-1.5">
        <button
          onClick={onPlayToggle}
          // Stop must always work, even if the sequence was cleared mid-playback.
          disabled={!canPlay && !isPlaying}
          aria-label={isPlaying ? "Stop" : "Play sequence"}
          title={canPlay ? undefined : "Add chords to the sequence to play it"}
          className={`flex-1 min-w-0 h-11 flex items-center justify-center gap-2 rounded-xl font-black text-lg transition
            ${isPlaying ? "bg-tertiary text-primary" : "bg-accent text-primary hover:brightness-110"}
            disabled:bg-notes disabled:text-accent/40 disabled:cursor-not-allowed`}
        >
          {isPlaying ? <StopIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
          <span className="hidden sm:inline">{isPlaying ? "STOP" : "PLAY"}</span>
          <span className="hidden sm:inline text-xs font-bold opacity-70">{bpm}</span>
        </button>

        <div
          className="flex bg-notes rounded-xl p-1 gap-0.5"
          role="radiogroup"
          aria-label="Play mode"
        >
          {PLAY_MODES.map((m) => (
            <button
              key={m.id}
              role="radio"
              aria-checked={mode === m.id}
              onClick={() => onModeChange(m.id)}
              title={m.title}
              className={`h-9 px-2 rounded-lg text-[11px] font-black tracking-wide ${mode === m.id ? "bg-tertiary text-primary" : "text-accent hover:bg-primary"}`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <DeckButton
          onClick={onOpenSequence}
          label="Sequence settings (tempo, rhythm, arpeggio)"
        >
          <QueueListIcon className="w-6 h-6" />
        </DeckButton>
        <DeckButton
          onClick={onOpenSound}
          label="Sound settings"
        >
          <AdjustmentsHorizontalIcon className="w-6 h-6" />
        </DeckButton>
        <DeckButton
          onClick={share}
          label={copied ? "Link copied" : "Copy a link to this sequence"}
        >
          {copied ? <CheckIcon className="w-6 h-6 text-tertiary" /> : <LinkIcon className="w-6 h-6" />}
        </DeckButton>
      </div>
    </div>
  );
};

export default TransportDeck;
