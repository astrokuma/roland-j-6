import React from "react";
import Piano from "./Piano";
import NoteTags from "./NoteTags";
import { Note } from "@tonaljs/tonal";
import { normalizeNote, isRootPresent } from "../utils/notes"; // Added import

const ScaleCard = ({ scaleName, notes = [], root, matchedNotes = [], matchPercentage = 0 }) => {
  // Normalize and simplify scale notes
  const normalizedScaleNotes = notes.map((note) => Note.simplify(Note.pitchClass(normalizeNote(note, root))));

  // Normalize and simplify matched notes (chord notes)
  const simplifiedMatchedNotes = matchedNotes.map((note) => Note.simplify(Note.pitchClass(normalizeNote(note, root))));

  // Calculate non-fitted notes (chord notes not in scale)
  const missingNotes = simplifiedMatchedNotes.filter((n) => !normalizedScaleNotes.includes(n));

  // Check root presence using normalized values
  const rootIsPresent = isRootPresent(root, simplifiedMatchedNotes);

  return (
    <li className="bg-primary rounded-lg overflow-hidden">
      <div className="flex flex-col gap-4">
        <h3 className="flex bg-notes border-b-4 border-background px-8 py-4 justify-between sm:text-base items-start text-center text-tertiary font-bold">
          {scaleName}
          <span>{matchPercentage.toFixed(0)}% match</span>
        </h3>

        <div className="flex flex-col justify-center items-center gap-4">
          <NoteTags
            notes={notes}
            root={rootIsPresent ? root : null}
            matchedNotes={matchedNotes}
            isScaleDisplay={true}
            rootIsPresent={rootIsPresent}
          />
          <Piano
            notes={notes}
            root={rootIsPresent ? root : null}
            selected={true}
          />
          <div>
            {missingNotes.length > 0 && (
              <div className="flex items-center text-secondary font-semibold mb-4">
                Non-scale notes:
                <span className="ml-2">{[...new Set(missingNotes)].join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default ScaleCard;
