import React from "react";
import { useTheme } from "./components/ThemeProvider";
import Header from "./components/Header";
import ControlPanel from "./components/ControlPanel";
import Footer from "./components/Footer";
import useChordState from "./hooks/useChordState";
import CardDisplay from "./components/CardDisplay";
import ScaleSection from "./components/ScaleSection";
import KeyboardDisplay from "./components/KeyboardDisplay";
import ClearButton from "./components/ClearButton";

const App = () => {
  const { themeName } = useTheme();
  const { selectedNumber, chordChartWithNumbers, selectedChart, selectedChords, selectedButtons, selectionOrder, handleClearAll, handleChordToggle, setSelectedNumber } = useChordState();

  const ChordInterfaceHeaderSection = ({ selectedChart, themeName, handleClearAll, selectedButtons, selectionOrder }) => (
    <>
      <KeyboardDisplay
        selectedButtons={selectedButtons}
        selectionOrder={selectionOrder}
        bankId={selectedChart?.number || ""}
        theme={themeName}
        className="col-span-8"
      />
      <ClearButton
        onClick={handleClearAll}
        className="col-span-4"
      />
    </>
  );

  return (
    <div className="min-h-dvh flex flex-col gap-4">
      <div className="w-full flex-1 flex-col gap-4 mx-auto">
        <div className="px-2 sticky bg-background -top-[12.2rem] sm:-top-[12.7rem] md:-top-[8.7rem] z-50 mx-auto w-full grid grid-cols-12 gap-2 font-medium py-2 sm:pt-4">
          <Header />
          <ControlPanel
            chordBanks={chordChartWithNumbers}
            selectedNumber={selectedNumber}
            onBankChange={setSelectedNumber}
          />
          <ChordInterfaceHeaderSection
            selectedChart={selectedChart}
            themeName={themeName}
            handleClearAll={handleClearAll}
            selectedButtons={selectedButtons}
            selectionOrder={selectionOrder}
          />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1">
          {selectedChart && (
            <CardDisplay
              bankId={selectedChart.number}
              chords={selectedChart.chords}
              selectedNotes={selectedChords}
              handleChordToggle={handleChordToggle}
              selectionOrder={selectionOrder}
            />
          )}
          {selectedChords.length > 0 && <ScaleSection selectedChords={selectedChords} />}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default App;
