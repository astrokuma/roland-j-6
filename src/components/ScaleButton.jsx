import React, { useState, useEffect } from "react";
import NoteTags from "./NoteTags"; // Import the NoteTags component

const ScaleButton = ({ scaleKey, scaleNotes }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLargerScreen, setIsLargerScreen] = useState(window.innerWidth >= 640); // "sm" breakpoint

  const toggleExpand = () => {
    if (!isLargerScreen) {
      setIsExpanded(!isExpanded); // Allow toggling only on small screens
    }
  };

  // Update the state when the window size changes
  useEffect(() => {
    const handleResize = () => {
      const largerScreen = window.innerWidth >= 640; // "sm" breakpoint
      setIsLargerScreen(largerScreen);
      if (largerScreen) {
        setIsExpanded(true); // Automatically expand on larger screens
      } else {
        setIsExpanded(false); // Collapse on small screens
      }
    };

    // Initial check on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center w-full border-4 border-sky-900 hover:border-sky-800 rounded-lg group">
      <button onClick={toggleExpand} className="w-full text-center rounded-t-sm bg-sky-900 group-hover:bg-sky-800 text-white font-semibold py-2 px-4">
        {scaleKey}
      </button>
      {/* Show expanded content based on isExpanded state */}
      <div className={`flex items-center justify-center p-2 max-w-xs overflow-hidden ${isExpanded ? "block" : "hidden"} h-24`}>
        <div className="flex items-center justify-center h-full">
          <NoteTags notes={scaleNotes.split(", ")} />
        </div>
      </div>
    </div>
  );
};

export default ScaleButton;
