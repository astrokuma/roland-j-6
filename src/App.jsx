import React, { useState, useEffect, useMemo } from "react";
import { normalizeNote } from "./utils/notes";
import { Note } from "@tonaljs/tonal";
import ChordBankSelector from "./components/ChordBankSelector";
import CardDisplay from "./components/CardDisplay";
import KeyboardDisplay from "./components/KeyboardDisplay";
import chordData from "./ChordChart.json";
import { BackspaceIcon } from "@heroicons/react/24/solid";
import ScaleBox from "./components/ScaleBox";
import { themeOptions } from "./utils/themeOptions";
import ThemeSwitcher from "./components/ThemeSwitcher";
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
const App = () => {
  const [currentTheme, setCurrentTheme] = useState("8008");
  const themeFiles = import.meta.glob("./themes/*.css", { as: "raw", eager: true });

  useEffect(() => {
    const themeKey = `./themes/${currentTheme}.css`;
    const cssContent = themeFiles[themeKey];

    if (cssContent) {
      let styleElement = document.getElementById("theme-style");
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = "theme-style";
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = cssContent;
    }
  }, [currentTheme]);

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

  const handleChordToggle = (chord, uniqueId, isSelected) => {
    setSelectedNotes((prev) =>
      isSelected
        ? prev.filter((item) => item.uniqueId !== uniqueId)
        : [
            ...prev,
            {
              uniqueId,
              notes: chord.notes,
              name: chord.name,
              root: chord.root,
            },
          ]
    );

    setSelectionOrder((prev) => (isSelected ? prev.filter((id) => id !== uniqueId) : [...prev, uniqueId]));

    // Update selectedChords
    setSelectedChords((prev) => {
      const exists = prev.some((c) => c.uniqueId === uniqueId);
      if (exists) {
        return prev.filter((c) => c.uniqueId !== uniqueId);
      }
      return [
        ...prev,
        {
          ...chord,
          uniqueId,
        },
      ];
    });

    // Update selectedButtons
    setSelectedButtons((prev) => {
      return prev.includes(uniqueId) ? prev.filter((b) => b !== uniqueId) : [...prev, uniqueId];
    });
  };

  return (
    <div className="min-h-dvh flex flex-col gap-4">
      <div className="w-full flex-1 flex-col gap-4 mx-auto">
        <div className="px-[2%] sticky backdrop-blur-md -top-[11.3rem] sm:-top-[11.7rem] md:-top-[7.7rem] xl:-top-[7.6rem] z-10 mx-auto w-full h-full grid grid-cols-12 gap-2 font-medium py-2 sm:py-4">
          <p className="col-span-12 py-2 bg-bg text-lg leading-none font-black text-text text-center rounded-lg">Roland J · 6</p>
          <div className="col-span-12 md:col-span-6 xl:col-start-1 gap-1 bg-bg shadow-md rounded-lg flex flex-col justify-center items-center py-2">
            <ThemeSwitcher
              themes={themeOptions}
              onChange={setCurrentTheme}
            />
          </div>
          <div className="justify-center col-span-12 md:col-span-6 bg-bg shadow-md rounded-lg p-3 flex flex-col gap-2 items-center ">
            <ChordBankSelector
              chords={chordChartWithNumbers}
              onChange={setSelectedNumber}
            />
          </div>
          <KeyboardDisplay
            selectedButtons={selectedButtons}
            selectionOrder={selectionOrder}
            bankId={selectedChart?.number || ""}
          />
          <button
            onClick={handleClearAll}
            className="col-span-4 py-2 bg-bg text-caret font-semibold rounded-md flex flex-row items-center justify-center gap-1 h-28"
          >
            <BackspaceIcon className="w-8" />
          </button>
        </div>
        {selectedChart && (
          <CardDisplay
            bankId={selectedChart.number}
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

export default App;
