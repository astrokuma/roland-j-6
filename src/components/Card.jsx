import React from "react";
import NoteTags from "./NoteTags";
import Piano from "./Piano";
import { getSelectionNumber } from "../utils/selectionUtils";

const Card = ({ chord, onClick, selected, selectionOrder, uniqueId }) => {
  return (
    <button
      className={`m-1 group transition-all outline outline-4 bg-sub-alt ${selected ? "outline-main" : "outline-main"} rounded-lg cursor-pointer`}
      onClick={onClick}
    >
      <div className={`relative flex transition-all rounded-t-md items-center justify-between text-center py-4 ${selected ? "bg-main" : "bg-bg"}`}>
        <p
          className={`transition-all absolute left-2 scale-75 sm:scale-100 w-8 h-8 flex items-center justify-center 
          font-extrabold rounded-full text-text ${selected ? "bg-sub-alt" : "invisible"}`}
        >
          {getSelectionNumber(uniqueId, selectionOrder)}
        </p>
        <h3 className={`transition-all mx-auto leading-none sm:text-2xl font-black ${selected ? "text-sub-alt" : "text-text"}`}>{chord.name}</h3>
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
    </button>
  );
};

export { Card };
