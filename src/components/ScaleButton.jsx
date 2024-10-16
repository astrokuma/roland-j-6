import React, { useState, useEffect } from "react";
import NoteTags from "./NoteTags";
import Piano from "./Piano";

const ScaleButton = ({ scaleKey, scaleNotes }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLargerScreen, setIsLargerScreen] = useState(window.innerWidth >= 640);

  const toggleExpand = () => {
    if (!isLargerScreen) {
      setIsExpanded(!isExpanded);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const largerScreen = window.innerWidth >= 640;
      setIsLargerScreen(largerScreen);
      setIsExpanded(largerScreen);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const notesArray = scaleNotes.split(", ");

  return (
    <div className="flex flex-col items-center w-full border-4 border-sky-900 hover:border-sky-800 rounded-lg group">
      <button
        onClick={toggleExpand}
        className="w-full text-center rounded-t-sm bg-sky-900 group-hover:bg-sky-800 text-white font-semibold py-2 px-4"
      >
        {scaleKey}
      </button>
      <div className={`flex flex-col gap-4 items-center justify-center p-2 w-full overflow-hidden ${isExpanded ? "block" : "hidden"}`}>
        <NoteTags notes={notesArray} />
        <Piano notes={notesArray} />
      </div>
    </div>
  );
};

export default ScaleButton;
