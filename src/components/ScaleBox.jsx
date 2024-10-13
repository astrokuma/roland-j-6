import React, { useMemo } from "react";
import * as Scale from "@tonaljs/scale";
import * as Note from "@tonaljs/note";
import ScaleButton from "./ScaleButton";
import NoteTags from "./NoteTags";

const ScaleBox = ({ selectedChords }) => {
  console.log("Selected Chords:", selectedChords);

  const allNotes = useMemo(() => {
    const notes = [...new Set(selectedChords.flat())];
    console.log("All Notes:", notes);
    return notes;
  }, [selectedChords]);

  const scaleNotes = useMemo(() => {
    const notes = [...new Set(allNotes.map((note) => Note.pitchClass(note)))];
    console.log("Scale Notes:", notes);
    return notes;
  }, [allNotes]);

  const possibleKeys = useMemo(() => {
    if (scaleNotes.length === 0) return [];

    const validNotes = scaleNotes.filter((note) => note !== "");
    console.log("Valid Scale Notes:", validNotes);

    const allScaleTypes = Scale.names();
    const keyMatches = [];

    validNotes.forEach((tonic) => {
      allScaleTypes.forEach((scaleType) => {
        const scale = Scale.get(`${tonic} ${scaleType}`);
        if (!scale.empty) {
          const scaleNotesArray = scale.notes.map(Note.pitchClass);
          const matchingNotes = validNotes.filter((note) => scaleNotesArray.includes(Note.pitchClass(note)));

          console.log(`Matching for ${tonic} ${scaleType}:`, matchingNotes);
          console.log(`Scale Notes:`, scaleNotesArray);

          if (matchingNotes.length > 0) {
            const matchPercentage = (matchingNotes.length / validNotes.length) * 100;
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
    <div className="w-full flex flex-col gap-4 text-center text-gray-400 ">
      <div className="flex  items-center gap-4">
        <p className="text-lg font-medium tracking-wide">NOTES:</p>

        <NoteTags notes={scaleNotes} />
      </div>
      {possibleKeys.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4  w-full">
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
        <span className="flex flex-col gap-2 items-center mt-2 outline outline-sky-950 py-2 px-4 rounded-full">Unknown 😔</span>
      )}
    </div>
  );
};

export default ScaleBox;
