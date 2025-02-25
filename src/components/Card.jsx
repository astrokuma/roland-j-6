import React from "react";
import NoteTags from "./NoteTags";
import Piano from "./Piano";
import { getSelectionNumber } from "../utils/selectionUtils";

const Card = ({ chord, onClick, selected, selectionOrder, uniqueId }) => {
  return (
    <button
      className={`m-1 group ${selected ? "bg-primary-300" : "bg-primary-100"} rounded-lg cursor-pointer`}
      onClick={onClick}
    >
      <div className={`relative flex rounded-t-md items-center justify-between text-center py-4 ${selected ? "bg-primary-400" : "bg-primary-200"}`}>
        <p
          className={`absolute left-2 scale-75 sm:scale-100 w-8 h-8 flex items-center justify-center 
          font-extrabold rounded-full text-primary-50 ${selected ? "bg-background-600" : "invisible"}`}
        >
          {getSelectionNumber(uniqueId, selectionOrder)}
        </p>
        <h3 className={`mx-auto leading-none sm:text-2xl font-black ${selected ? "text-background-600" : "text-accent-600"}`}>{chord.name}</h3>
      </div>
      <div className="flex flex-col items-center gap-4 px-2 py-4">
        <NoteTags
          notes={chord.notes}
          root={chord.root}
        />
        <Piano
          notes={chord.notes}
          root={chord.root}
        />
      </div>
    </button>
  );
};

export { Card };
