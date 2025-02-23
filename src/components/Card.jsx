import React from "react";
import NoteTags from "./NoteTags";
import Piano from "./Piano";
import { getSelectionNumber } from "../utils/selectionUtils";

const Card = ({ chord, onClick, selected, selectionOrder, num, hasError, errorKey }) => {
  return (
    <div
      className={`m-1 group transition-all outline outline-4 
        ${selected ? "outline-yellow-800 bg-gray-900" : hasError && errorKey === num ? "outline-red-500 bg-gray-950" : "hover:outline-yellow-900 outline-yellow-950 bg-gray-950"} 
        rounded-lg cursor-pointer`}
      onClick={onClick}
    >
      <div className={`relative flex transition-all rounded-t-md items-center justify-between text-center py-4 ${selected ? "bg-yellow-800" : "bg-yellow-950 group-hover:bg-yellow-900"}`}>
        <p
          className={`transition-all absolute left-2 scale-75 sm:scale-100 w-8 h-8 flex items-center justify-center 
          font-extrabold rounded-full text-yellow-700 ${selected ? "bg-gray-900" : "invisible"}`}
        >
          {getSelectionNumber(num, selectionOrder)}
        </p>
        <h3 className={`transition-all mx-auto leading-none sm:text-2xl font-black ${selected ? "text-gray-950" : "text-yellow-600"}`}>{chord.name}</h3>
      </div>
      <div className="transition-all flex flex-col items-center gap-4 px-2 py-4">
        <NoteTags
          notes={chord.notes}
          root={chord.root}
        />
        <Piano
          notes={chord.notes}
          root={chord.root}
        />
      </div>
    </div>
  );
};

export { Card };
