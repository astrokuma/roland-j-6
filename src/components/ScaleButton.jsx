import React from "react";
import NoteTags from "./NoteTags";

const ScaleButton = ({ scaleName, notes, matchPercentage, root, matchedNotes }) => {
  return (
    <li className="flex">
      <div className="w-full border-4 border-sky-900 rounded-lg">
        <div className="w-full text-center bg-sky-900 text-white font-semibold py-2 px-4">
          {scaleName} ({matchPercentage}% match)
        </div>

        <div className="p-4 bg-sky-950/50">
          <NoteTags
            notes={notes} // Fixed: Use direct notes prop
            root={root} // Fixed: Use direct root prop
            matchedNotes={matchedNotes}
            isScaleDisplay={true}
          />
        </div>
      </div>
    </li>
  );
};

export default ScaleButton;
