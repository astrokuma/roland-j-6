import NoteTags from "./NoteTags";

const Card = ({ chord, onClick, selected, bgColor }) => {
  const borderColor = selected ? "border-sky-800" : "border-sky-950"; // Use default or selected border color

  return (
    <div
      className={`${bgColor} border-4 ${borderColor} hover:border-sky-700 hover:cursor-pointer rounded-lg overflow-hidden `}
      onClick={onClick}
    >
      <div className={`text-center py-4 ${selected ? "bg-sky-800" : "bg-sky-950"} text-white`}>
        <h3 className="text-xl font-semibold">{chord.transposedName || chord.originalName || "Unknown Chord"}</h3>
      </div>
      <div className="flex flex-col items-center gap-4 px-2 py-4">
        <div className="text-gray-400">
          <NoteTags notes={chord.transposedNotes} />
        </div>
      </div>
    </div>
  );
};

export { Card };
