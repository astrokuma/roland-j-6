import React, { useState, useEffect, useMemo } from "react";
import ChordBankSelector from "./components/ChordBankSelector";
import CardDisplay from "./components/CardDisplay";
import KeyboardDisplay from "./components/KeyboardDisplay";
import chordData from "./ChordChart.json";
import TransposeControl from "./components/TransposeControl";
import { BackspaceIcon } from "@heroicons/react/24/solid";
import ScaleBox from "./components/ScaleBox";
import Footer from "./components/Footer";
import { stripChordName, transposeNote, transposeStrippedChord } from "./utils/helperFunctions";

const reassembleChord = (transposedChord, originalModifiers) => {
  const parts = transposedChord.split("/").map((part) => part.trim());

  // Handle the case where we may have a root with modifiers and a bass
  const rootWithModifiers = parts[0];
  const bass = parts.length > 1 ? parts[1] : null;

  // Combine root and modifiers, and if there's a bass, format it accordingly
  if (bass) {
    return (
      <>
        {rootWithModifiers}
        <span className="text-sm ml-0.5">{originalModifiers}</span> / {bass}
      </>
    );
  } else {
    return (
      <>
        {rootWithModifiers}
        <span className="text-sm ml-0.5">{originalModifiers}</span>
      </>
    );
  }
};

// Main Component
const ChordChart = () => {
  const [selectedNumber, setSelectedNumber] = useState("1");
  const [transposition, setTransposition] = useState(0);
  const [displayTransposition, setDisplayTransposition] = useState(0);
  const [displayedChords, setDisplayedChords] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [selectionOrder, setSelectionOrder] = useState([]);

  //returns chord data for each chord bank along with numberID
  const chordChartWithNumbers = useMemo(() => {
    if (!chordData || !chordData.chord_chart) {
      console.error("Chord data is missing or invalid");
      return [];
    }
    return chordData.chord_chart.map((chart, index) => ({
      genre: chart.genre,
      number: (index + 1).toString(),
      chords: chart.chords.map((chord, chordIndex) => ({
        name: chord.name,
        notes: chord.notes,
        button: (chordIndex + 1).toString(),
      })),
    }));
  }, []);

  //returns the corresponding chord bank object based on selectedNumber
  const selectedChart = useMemo(() => {
    return chordChartWithNumbers.find((chart) => chart.number === selectedNumber);
  }, [chordChartWithNumbers, selectedNumber]);

  const handleClearAll = () => {
    setSelectedNotes([]);
    setSelectedButtons([]);
    setSelectionOrder([]);
  };

  //returns transposed chord object
  const transposeChords = useMemo(
    () => (chords, semitones) => {
      return chords.map((chordObj) => {
        const { name, notes, button } = chordObj;
        const { strippedChord, originalModifiers } = stripChordName(name);
        const transposedStrippedChord = transposeStrippedChord(strippedChord, semitones);
        const transposedChordName = reassembleChord(transposedStrippedChord, originalModifiers);

        return {
          originalName: name,
          transposedName: transposedChordName,
          transposedNotes: notes.map((note) => transposeNote(note, semitones)),
          button,
        };
      });
    },
    []
  );

  useEffect(() => {
    if (selectedChart) {
      const newDisplayedChords = transposeChords(selectedChart.chords, transposition);
      setDisplayedChords(newDisplayedChords);
    }
  }, [selectedChart, transposition, transposeChords]);

  const handleTranspose = (direction) => {
    setTransposition((prev) => {
      const newTransposition = Math.max(-12, Math.min(12, prev + direction));
      return newTransposition;
    });
    setDisplayTransposition((prev) => {
      const newDisplayTransposition = Math.max(-12, Math.min(12, prev + direction));
      return newDisplayTransposition;
    });
  };

  const handleChordToggle = (notes, button, isSelected) => {
    setSelectedNotes((prevNotes) => {
      if (isSelected) {
        return prevNotes.filter((noteArray) => noteArray.join(",") !== notes.join(","));
      } else {
        return [...prevNotes, notes];
      }
    });

    setSelectedButtons((prevButtons) => {
      if (isSelected) {
        return prevButtons.filter((b) => b !== button);
      } else {
        return [...prevButtons, button];
      }
    });

    setSelectionOrder((prevOrder) => {
      if (isSelected) {
        return prevOrder.filter((b) => b !== button);
      } else {
        return [...prevOrder, button];
      }
    });
  };

  const buttonClassName = "bg-gray-950 hover:bg-gray-950/70 rounded-lg shadow-sm relative flex items-center justify-center rounded-lg px-4 py-1 shadow-sm focus:outline-none appearance-none cursor-pointer h-10 w-10";

  return (
    <div className="w-full flex flex-col gap-4 h-screen mx-auto">
      {/* //header and chord display */}
      <div className="flex flex-col gap-2 sm:gap-4">
        <div className="px-[4%] sticky backdrop-blur-md shadow-lg shadow-neutral-950 rounded-md -top-[12.4rem] sm:-top-32 xl:top-0 offset z-10 max-w-6xl mx-auto w-full h-full grid grid-cols-12 gap-3 sm:gap-4 text-yellow-600 font-medium py-2 sm:py-4">
          <div className="col-span-12 xl:col-span-2 sm:col-span-3 sm:col-start-2 xl:col-start-1 gap-1 bg-sky-950 shadow-md rounded-lg flex flex-col justify-center items-center font-black py-2">
            <p className="text-md leading-none text-yellow-700">Roland</p>
            <p className="text-3xl leading-none text-yellow-600">J · 6</p>
          </div>
          <div className="col-span-12 sm:col-span-7 xl:col-span-5 bg-sky-950 shadow-md rounded-lg p-3 flex flex-col gap-2 items-center ">
            <ChordBankSelector
              chords={chordChartWithNumbers}
              onChange={setSelectedNumber}
              buttonClassName={buttonClassName}
            />
            <TransposeControl
              onTranspose={handleTranspose}
              displayTransposition={displayTransposition}
              buttonClassName={buttonClassName}
            />
          </div>
          <KeyboardDisplay
            selectedButtons={selectedButtons}
            selectionOrder={selectionOrder}
          />
          <button
            onClick={handleClearAll}
            className="col-span-3 xl:col-span-2 py-2 bg-red-900 hover:bg-red-800 text-yellow-400 font-semibold rounded-md transition-colors duration-200 flex flex-row items-center justify-center gap-1 h-28"
          >
            <BackspaceIcon className="w-8" />
          </button>
        </div>
        {/* //chord display */}
        {selectedChart && (
          <CardDisplay
            chords={displayedChords}
            selectedNotes={selectedNotes}
            handleChordToggle={handleChordToggle}
            selectionOrder={selectionOrder}
          />
        )}

        {/* //scale info */}
        {selectedNotes && <ScaleBox selectedChords={selectedNotes} />}
      </div>
      <Footer />
    </div>
  );
};

export default ChordChart;
