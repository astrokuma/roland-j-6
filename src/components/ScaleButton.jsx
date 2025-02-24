import React from "react";
import { Note } from "@tonaljs/tonal";
import NoteTags from "./NoteTags";

const ScaleButton = ({ scaleName, notes, matchPercentage, root, matchedNotes }) => {
  const normalizedMatchedNotes = matchedNotes.map((n) => Note.simplify(Note.pitchClass(n)));
  const normalizedScaleNotes = notes.map((n) => Note.simplify(Note.pitchClass(n)));
  const missingNotes = normalizedMatchedNotes.filter((n) => !normalizedScaleNotes.includes(n));
  return (
    <li className="flex">
      <button className="w-full border-4 border-main bg-sub-alt rounded-lg">
        <div className="w-full text-center bg-bg text-main rounded-t-lg font-semibold py-2 px-4">
          {scaleName} ({matchPercentage}% match)
        </div>

        <div className="p-4">
          <NoteTags
            notes={notes}
            root={root}
            matchedNotes={matchedNotes}
            missingNotes={missingNotes}
            isScaleDisplay={true}
          />
        </div>
      </button>
    </li>
  );
};

export default ScaleButton;
