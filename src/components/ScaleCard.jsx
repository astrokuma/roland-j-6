import React from "react";
import { Note } from "@tonaljs/tonal";
import NoteTags from "./NoteTags";
import { normalizeNote } from "../utils/notes";

const ScaleCard = ({ scaleName, notes, root, matchedNotes, matchPercentage }) => {
  const normalizedMatchedNotes = matchedNotes.map((n) => Note.simplify(Note.pitchClass(normalizeNote(n, root))));
  const normalizedScaleNotes = notes.map((n) => Note.simplify(Note.pitchClass(normalizeNote(n, root))));
  const missingNotes = normalizedMatchedNotes.filter((n) => !normalizedScaleNotes.includes(n));

  return (
    <li className="flex bg-primary rounded-lg">
      <div className="w-full text-accent">
        <div className="border-b-4 bg-notes rounded-t-lg border-background text-center font-bold py-2 px-4">
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

export default ScaleCard;
