import React from "react";

const NoteTags = ({ notes }) => {
  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {notes.map((note, index) => (
        <span key={index} className="bg-sky-950 text-white font-semibold rounded-full p-2 px-3 text-md">
          {note}
        </span>
      ))}
    </div>
  );
};

export default NoteTags;
