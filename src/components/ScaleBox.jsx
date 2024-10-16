import React, { useMemo } from "react";
import * as Scale from "@tonaljs/scale";
import * as Note from "@tonaljs/note";
import ScaleButton from "./ScaleButton";
import NoteTags from "./NoteTags";

const ScaleBox = ({ selectedChords }) => {
  const allNotes = useMemo(() => {
    const notes = [...new Set(selectedChords.flat())];
    return notes;
  }, [selectedChords]);

  const scaleNotes = useMemo(() => {
    return [...new Set(allNotes.map((note) => Note.pitchClass(note)))].filter((note) => note !== "");
  }, [allNotes]);

  // Define the scale modes you want to check
  const scaleModes = ["Major", "Minor", "Minor Pentatonic", "Major Pentatonic", "Harmonic Minor", "Blues", "Mixolydian", "Dorian"];

  const possibleKeys = useMemo(() => {
    if (scaleNotes.length === 0) return [];

    const keyMatches = [];

    scaleNotes.forEach((tonic) => {
      scaleModes.forEach((scaleType) => {
        const scale = Scale.get(`${tonic} ${scaleType}`);
        if (!scale.empty) {
          const scaleNotesArray = scale.notes.map(Note.pitchClass);
          const matchingNotes = scaleNotes.filter((note) => scaleNotesArray.includes(note));

          if (matchingNotes.length > 0) {
            const matchPercentage = (matchingNotes.length / scaleNotes.length) * 100;
            if (matchPercentage > 86) {
              keyMatches.push({
                key: `${tonic} ${scaleType}`,
                matchPercentage,
                scaleNotes: scaleNotesArray.join(", "),
              });
            }
          }
        }
      });
    });

    return keyMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [scaleNotes]);

  if (selectedChords.length === 0) {
    return null;
  }

  return (
    <div className="px-[4%] w-full max-w-6xl mx-auto flex flex-col gap-4 text-center text-gray-400">
      <div className="flex items-center gap-4">
        <p className="text-lg font-medium tracking-wide">NOTES:</p>
        <NoteTags notes={scaleNotes} />
      </div>
      {possibleKeys.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
          {possibleKeys.map((key, index) => (
            <li
              key={index}
              className="flex"
            >
              <ScaleButton
                scaleKey={`${key.key} (${key.matchPercentage.toFixed(2)}% match)`}
                scaleNotes={key.scaleNotes}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="w-full text-center rounded-sm bg-sky-900 group-hover:bg-sky-800 text-white font-semibold py-2 px-4">SCALE: Unknown 😔</p>
      )}
    </div>
  );
};

export default ScaleBox;
