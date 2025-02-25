import { useState, useMemo } from "react";
import chordData from "../ChordChart.json";
import { normalizeNote } from "../utils/notes";
import { Note } from "@tonaljs/tonal";

const useChordState = () => {
  const [selectedNumber, setSelectedNumber] = useState("1");
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [selectionOrder, setSelectionOrder] = useState([]);
  const [selectedChords, setSelectedChords] = useState([]);

  const chordChartWithNumbers = useMemo(() => {
    if (!chordData?.chord_chart) return [];
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

  const selectedChart = useMemo(() => chordChartWithNumbers.find((chart) => chart.number === selectedNumber), [chordChartWithNumbers, selectedNumber]);

  const handleClearAll = () => {
    setSelectedNotes([]);
    setSelectedChords([]);
    setSelectedButtons([]);
    setSelectionOrder([]);
  };

  const handleChordToggle = (chord, uniqueId, isSelected) => {
    setSelectedNotes((prev) => (isSelected ? prev.filter((item) => item.uniqueId !== uniqueId) : [...prev, { uniqueId, ...chord }]));

    setSelectionOrder((prev) => (isSelected ? prev.filter((id) => id !== uniqueId) : [...prev, uniqueId]));

    setSelectedChords((prev) => (isSelected ? prev.filter((c) => c.uniqueId !== uniqueId) : [...prev, { ...chord, uniqueId }]));

    setSelectedButtons((prev) => (isSelected ? prev.filter((b) => b !== uniqueId) : [...prev, uniqueId]));
  };

  return {
    selectedNumber,
    chordChartWithNumbers,
    selectedChart,
    selectedChords,
    selectedButtons,
    selectionOrder,
    handleClearAll,
    handleChordToggle,
    setSelectedNumber,
  };
};

export default useChordState;
