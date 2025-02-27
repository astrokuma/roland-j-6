import React from "react";
import NoteTags from "./NoteTags";
import Piano from "./Piano";
import { getSelectionNumber } from "../utils/selectionUtils";

const Card = ({ chord, onClick, selected, selectionOrder, uniqueId }) => {
  return (
    <button
      className={`m-1 group rounded-lg ${selected ? "bg-primary" : "bg-primary "} cursor-pointer`}
      onClick={onClick}
    >
      <div className={`relative flex items-center justify-between text-center py-4 rounded-t-lg border-b-4 border-background ${selected ? "bg-accent" : "bg-secondary"}`}>
        <p
          className={`absolute left-2 scale-75 sm:scale-100 w-8 h-8 flex items-center justify-center 
          font-extrabold rounded-full text-accent ${selected ? "bg-primary" : "invisible"}`}
        >
          {getSelectionNumber(uniqueId, selectionOrder)}
        </p>
        <h3 className={`mx-auto leading-none sm:text-2xl font-black ${selected ? "text-primary" : "text-tertiary"}`}>{chord.name}</h3>
      </div>
      <div className="flex flex-col items-center group gap-4 px-2 py-4">
        <NoteTags
          notes={chord.notes}
          root={chord.root}
        />
        <Piano
          notes={chord.notes}
          root={chord.root}
          selected={selected}
        />
      </div>
    </button>
  );
};

export { Card };
