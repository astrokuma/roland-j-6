import React from "react";
import { Note } from "@tonaljs/tonal";
import NoteTags from "./NoteTags";
import { normalizeNote } from "../utils/notes";

const ScaleButton = ({ scaleName, notes, root, matchedNotes, matchPercentage }) => {
  const normalizedMatchedNotes = matchedNotes.map((n) => normalizeNote(n, root));
  const normalizedScaleNotes = notes.map((n) => normalizeNote(n, root));
  const missingNotes = normalizedMatchedNotes.filter((n) => !normalizedScaleNotes.includes(n));

  return (
    <li className="flex">
      <div className="w-full border-4 border-accent-500 rounded-lg">
        <div className="w-full text-center bg-accent-500 rounded-t-sm font-bold py-2 px-4">
          {scaleName} ({typeof matchPercentage === "number" ? `${Math.round(matchPercentage)}% match` : "N/A"})
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
      </div>
    </li>
  );
};

export default ScaleButton;
