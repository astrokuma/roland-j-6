import React from "react";
import NoteTags from "./NoteTags";
import Piano from "./Piano";
import { getSelectionNumber } from "../utils/selectionUtils";

const Card = ({ chord, onClick, selected, selectionOrder, num }) => {
  const handleInteraction = () => {
    onClick();
  };

  return (
    <div
      className={`m-1 group outline outline-4 ${selected ? "outline-yellow-800 bg-gray-900 hover:bg-gray-900 hover:outline-yellow-800" : "outline-yellow-950 bg-gray-950 hover:bg-gray-950 hover:outline-yellow-950"} rounded-lg cursor-pointer`}
      onClick={handleInteraction}
      role="button"
      tabIndex={0}
    >
      <div className={`relative flex rounded-t-md items-center justify-between text-center py-4 ${selected ? "bg-yellow-800" : "bg-yellow-950 group-hover:bg-yellow-950 hover:text-yellow-600"}`}>
        <p className={`absolute scale-75 sm:scale-100 sm:ml-2 w-10 h-10 flex items-center justify-center font-bold rounded-full ${selected ? "visible bg-gray-900 text-yellow-700" : "invisible"}`}>{getSelectionNumber(num, selectionOrder)}</p>
        <h3 className={`mx-auto leading-none sm:text-2xl font-black ${selected ? "text-gray-950" : "text-yellow-600"}`}>{chord.transposedName}</h3>
      </div>
      <div className="flex flex-col items-center gap-4 px-2 py-4">
        <NoteTags notes={chord.transposedNotes} />
        <Piano notes={chord.transposedNotes} />
      </div>
    </div>
  );
};

export { Card };
