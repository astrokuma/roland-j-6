import React from "react";

const NoteTags = ({ notes }) => {
  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {notes.map((note, index) => {
        // Determine background color based on note type
        const bgColor = note.includes("#") || note.includes("b") ? "bg-yellow-700" : "bg-yellow-600";

        return (
          <span
            key={index}
            className={`flex justify-center items-center text-gray-950 font-bold rounded-full w-8 h-8 text-sm sm:w-10 sm:h-10 sm:text-base ${bgColor}`}
          >
            {note}
          </span>
        );
      })}
    </div>
  );
};

export default NoteTags;
