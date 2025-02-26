import React from "react";
import ThemeSelector from "./ThemeSelector";
import ChordBankSelector from "./ChordBankSelector";
import { themes } from "../constants/themes";

const ControlPanel = ({ chordBanks, selectedNumber, onBankChange }) => (
  <>
    <div className="col-span-12 md:col-span-6 xl:col-start-1 gap-1 bg-primary rounded-lg flex flex-col justify-center items-center py-2">
      <ThemeSelector themes={themes} />
    </div>
    <div className="bg-primary col-span-12 md:col-span-6 rounded-lg p-3 flex flex-col gap-2 items-center">
      <ChordBankSelector
        chords={chordBanks}
        onChange={onBankChange}
        selectedNumber={selectedNumber}
      />
    </div>
  </>
);

export default ControlPanel;
