import React, { useState } from "react";
import { useTheme } from "./components/ThemeProvider";
import Header from "./components/Header";
import ControlPanel from "./components/ControlPanel";
import Footer from "./components/Footer";
import useChordState from "./hooks/useChordState";
import CardDisplay from "./components/CardDisplay";
import ScaleSection from "./components/ScaleSection";
import KeyboardDisplay from "./components/KeyboardDisplay";
import ClearButton from "./components/ClearButton";
import useAudioPlayer from "./hooks/useAudioPlayer";
import SoundControlModal from "./components/SoundControlModal";
import ArpSettingsModal from "./components/ArpSettingsModal"; // Import New Modal
import TransportDeck from "./components/TransportDeck";

const App = () => {
  const { themeName } = useTheme();
  const { selectedNumber, chordChartWithNumbers, selectedChart, selectedChords, selectedButtons, selectionOrder, handleClearAll, handleChordToggle, setSelectedNumber } = useChordState();

  const [isSoundSettingsOpen, setIsSoundSettingsOpen] = useState(false);
  const [isArpSettingsOpen, setIsArpSettingsOpen] = useState(false); // New State

  const { playChord, startSequencer, stopSequence, isPlaying, synthParams, setSynthParams, bpm, setBpm, playMode, setPlayMode, arpSettings, setArpSettings } = useAudioPlayer();

  const handlePlayToggle = () => {
    if (isPlaying) {
      stopSequence();
    } else {
      const orderedChords = selectionOrder.map((id) => selectedChords.find((c) => c.uniqueId === id)).filter(Boolean);
      startSequencer(orderedChords);
    }
  };

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
    <div className="min-h-dvh flex flex-col gap-4 relative pb-32">
      <div className="w-full flex-1 flex-col gap-4 mx-auto">
        {/* ... Header Section ... */}
        <div className="px-2 2xl:max-w-[85%] sticky bg-background rounded-b-lg -top-[12rem] sm:-top-[12rem] md:-top-[8rem] z-30 mx-auto w-full grid grid-cols-12 gap-2 font-medium py-2">
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

        <div className="flex-1">
          {selectedChart && (
            <CardDisplay
              bankId={selectedChart.number}
              chords={selectedChart.chords}
              selectedNotes={selectedChords}
              selectionOrder={selectionOrder}
              handleChordToggle={(chord, id, isSelected) => {
                handleChordToggle(chord, id, isSelected);
                if (!isSelected) playChord(chord.notes);
              }}
            />
          )}
          {selectedChords.length > 0 && <ScaleSection selectedChords={selectedChords} />}
        </div>

        {/* Transport Deck */}
        <TransportDeck
          isPlaying={isPlaying}
          onPlayToggle={handlePlayToggle}
          playMode={playMode}
          setPlayMode={setPlayMode}
          onOpenSoundSettings={() => setIsSoundSettingsOpen(true)}
          onOpenArpSettings={() => setIsArpSettingsOpen(true)} // Open New Modal
          hasChords={selectedChords.length > 0}
        />

        {/* Modals */}
        <SoundControlModal
          isOpen={isSoundSettingsOpen}
          onClose={() => setIsSoundSettingsOpen(false)}
          synthParams={synthParams}
          setSynthParams={setSynthParams}
          bpm={bpm}
          setBpm={setBpm}
        />

        <ArpSettingsModal
          isOpen={isArpSettingsOpen}
          onClose={() => setIsArpSettingsOpen(false)}
          arpSettings={arpSettings}
          setArpSettings={setArpSettings}
          playMode={playMode}
        />

        <Footer />
      </div>
    </div>
  );
};

export default App;
