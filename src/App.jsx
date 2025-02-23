import React, { useState, useMemo } from "react";
import { normalizeNote } from "./utils/notes";
import { Note } from "@tonaljs/tonal";
import ChordBankSelector from "./components/ChordBankSelector";
import CardDisplay from "./components/CardDisplay";
import KeyboardDisplay from "./components/KeyboardDisplay";
import chordData from "./ChordChart.json";
import { BackspaceIcon } from "@heroicons/react/24/solid";
import ScaleBox from "./components/ScaleBox";
import Footer from "./components/Footer";

const reassembleChord = (originalModifiers) => {
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
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [selectionOrder, setSelectionOrder] = useState([]);
  const [selectedChords, setSelectedChords] = useState([]);

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
        root: chord.root,
        button: (chordIndex + 1).toString(),
      })),
    }));
  }, []);

  //returns the corresponding chord bank object based on selectedNumber
  const selectedChart = useMemo(() => {
    return chordChartWithNumbers.find((chart) => chart.number === selectedNumber);
  }, [chordChartWithNumbers, selectedNumber]);

  const handleClearAll = () => {
    setSelectedNotes([]); // Clears selected notes
    setSelectedChords([]); // Clears selected chords
    setSelectedButtons([]); // Clears selected buttons
    setSelectionOrder([]); // Clears selection order
    console.log("All selections cleared");
  };

  //returns transposed chord object
  const displayedChords = useMemo(() => {
    if (!selectedChart) return [];
    return selectedChart.chords.map((chord) => ({
      ...chord,
      transposedNotes: chord.notes.map(
        (n) => normalizeNote(Note.pitchClass(n), chord.root) // Properly formatted
      ),
    }));
  }, [selectedChart]);

  const handleChordToggle = (chord, button) => {
    const isSelected = selectedNotes.some((notes) => notes.notes.join(",") === chord.notes.join(","));

    // Update selectedNotes state
    setSelectedNotes((prev) => {
      if (isSelected) {
        return prev.filter((notes) => notes.notes.join(",") !== chord.notes.join(","));
      } else {
        return [...prev, { notes: chord.notes, button }];
      }
    });

    // Update selectedChords and selectedButtons
    setSelectedChords((prev) => {
      const exists = prev.some((c) => c.name === chord.name);
      if (exists) {
        return prev.filter((c) => c.name !== chord.name);
      }
      return [...prev, chord];
    });

    setSelectedButtons((prev) => {
      const newButtons = prev.includes(button) ? prev.filter((b) => b !== button) : [...prev, button];
      return newButtons;
    });

    setSelectionOrder((prev) => {
      const newOrder = prev.includes(button) ? prev.filter((b) => b !== button) : [...prev, button];
      return newOrder;
    });
  };

  const buttonClassName = "bg-gray-950 hover:bg-gray-950/70 rounded-lg shadow-sm relative flex items-center justify-center rounded-lg px-4 py-1 shadow-sm focus:outline-none appearance-none cursor-pointer h-10 w-10";

  return (
    <div className="w-full flex flex-col gap-4 h-screen mx-auto">
      <div className="flex flex-col gap-2 sm:gap-4">
        <div className="px-[4%] sticky backdrop-blur-md shadow-lg shadow-neutral-950 rounded-md -top-[9.4rem] sm:-top-[5.2rem] xl:top-0 offset z-10 max-w-6xl mx-auto w-full h-full grid grid-cols-12 gap-3 sm:gap-4 text-yellow-600 font-medium py-2 sm:py-4">
          <div className="col-span-12 xl:col-span-2 sm:col-span-3 sm:col-start-2 xl:col-start-1 gap-1 bg-sky-950 shadow-md rounded-lg flex flex-col justify-center items-center font-black py-2">
            <p className="text-md leading-none text-yellow-700">Roland</p>
            <p className="text-3xl leading-none text-yellow-600">J · 6</p>
          </div>
          <div className="animate-headShake col-span-12 sm:col-span-7 xl:col-span-5 bg-sky-950 shadow-md rounded-lg p-3 flex flex-col gap-2 items-center ">
            <ChordBankSelector
              chords={chordChartWithNumbers}
              onChange={setSelectedNumber}
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
        {selectedChart && (
          <CardDisplay
            chords={displayedChords}
            selectedNotes={selectedNotes}
            handleChordToggle={handleChordToggle}
            selectionOrder={selectionOrder}
          />
        )}
        {console.log(selectedChords)}
        {selectedChords.length > 0 && <ScaleBox selectedChords={selectedChords} />}
      </div>
      <Footer />
    </div>
  );
};

export default ChordChart;
