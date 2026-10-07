import React, { memo, useMemo } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import KeyboardSvg from "./KeyboardSvg";
import { analyzeChord, voicingWindow } from "../utils/chordTheory";
import { KEY_NAMES } from "../data/banks";

const VoicingChip = ({ note }) => (
  <span
    className={`flex flex-col items-center justify-center min-w-8 h-10 px-1 rounded-lg leading-none
      ${note.isRoot ? "bg-tertiary text-primary" : "bg-accent text-primary"}
      ${note.isBass ? "ring-2 ring-tertiary ring-offset-2 ring-offset-primary" : ""}`}
    title={`${note.name}${note.degree ? ` · ${note.degree}` : ""}${note.isBass ? " · bass" : ""}`}
  >
    <span className="text-xs font-black">{note.name}</span>
    <span className="text-[10px] font-bold opacity-75 mt-0.5">{note.degree === "R" ? "root" : note.degree}</span>
  </span>
);

const ChordCard = ({ chord, stepNumbers = [], isPlaying, isLit, isDimmed, recording, onPress }) => {
  const analysis = useMemo(() => analyzeChord(chord), [chord]);
  const midis = analysis.voicing.map((v) => v.midi);
  const range = voicingWindow(midis);
  const inSequence = stepNumbers.length > 0;
  const keyName = KEY_NAMES[chord.key - 1];

  const keyState = (midi) => {
    const note = analysis.voicing.find((v) => v.midi === midi);
    if (!note) return null;
    return note.isRoot ? "root" : "tone";
  };

  const shownSteps = stepNumbers.slice(0, 3).join(" · ") + (stepNumbers.length > 3 ? ` +${stepNumbers.length - 3}` : "");

  return (
    <button
      onClick={() => onPress(chord.key)}
      aria-label={`${chord.name}, key ${keyName}. ${recording ? "Add to sequence" : "Play"}`}
      className={`group relative rounded-xl bg-primary text-left overflow-hidden transition
        outline outline-[3px] -outline-offset-[3px] ${isPlaying || isLit ? "outline-tertiary" : "outline-transparent"}
        ${isDimmed ? "opacity-35" : ""} hover:brightness-110 focus-visible:outline-accent`}
    >
      <div className={`relative flex items-center justify-center min-h-14 px-10 py-3 border-b-4 border-background ${inSequence ? "bg-accent" : "bg-notes"}`}>
        <span
          className={`absolute left-2 top-2 min-w-7 h-6 px-1.5 rounded-md text-[11px] font-black flex items-center justify-center
          ${inSequence ? "bg-primary text-accent" : "bg-primary/70 text-accent"}`}
          title={`J-6 key ${keyName}`}
        >
          {keyName}
        </span>
        <h3 className={`text-center leading-tight text-base sm:text-2xl font-black break-words ${inSequence ? "text-primary" : "text-tertiary"}`}>{chord.name}</h3>
        {inSequence && (
          <span
            className="absolute right-2 top-2 h-6 px-1.5 rounded-md bg-primary text-accent text-[11px] font-black flex items-center"
            title={`Steps ${stepNumbers.join(", ")}`}
          >
            {shownSteps}
          </span>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 px-2 sm:px-3 py-4">
        <div className="flex flex-wrap justify-center gap-1.5">
          {analysis.voicing.map((note, i) => (
            <VoicingChip
              key={i}
              note={note}
            />
          ))}
        </div>

        <div className="min-h-6 flex flex-wrap items-center justify-center gap-1 text-[11px] font-bold text-accent">
          {analysis.isOctaveStack ? (
            <span className="opacity-80">Octave stack</span>
          ) : analysis.omitted.length ? (
            <>
              <span className="opacity-80">Leaves out</span>
              {analysis.omitted.map((o) => (
                <span
                  key={o.chroma}
                  className="px-1.5 py-0.5 rounded-md border border-dashed border-accent"
                >
                  {o.name} <span className="opacity-75">({o.degree === "R" ? "root" : o.degree})</span>
                </span>
              ))}
            </>
          ) : (
            <span className="opacity-60">Complete chord</span>
          )}
        </div>

        <KeyboardSvg
          startOctave={range.startOctave}
          octaves={range.octaves}
          keyState={keyState}
          markers={[midis[0]]}
          labelOctaves
          className="max-w-xs"
        />

        {chord.remark && (
          <p className="flex gap-1 text-[11px] leading-snug text-accent/90 font-semibold">
            <InformationCircleIcon className="w-4 h-4 shrink-0" />
            <span>{chord.remark}</span>
          </p>
        )}
      </div>
    </button>
  );
};

export default memo(ChordCard);
