// ScaleCards.jsx - Simplified display
import React from "react";
import NoteTags from "./NoteTags";

const ScaleCards = ({ scaleName, notes, root, matchPercentage }) => {
  return (
    <div className="scale-card">
      <h3>
        {scaleName} ({Math.round(matchPercentage)}% match)
      </h3>
      <NoteTags
        notes={notes}
        root={root}
      />
    </div>
  );
};

export default ScaleCards;
