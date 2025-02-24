import React, { useState, useEffect, useMemo } from "react";
import { normalizeNote } from "./utils/notes";
import { Note } from "@tonaljs/tonal";
import ChordBankSelector from "./components/ChordBankSelector";
import CardDisplay from "./components/CardDisplay";
import KeyboardDisplay from "./components/KeyboardDisplay";
import chordData from "./ChordChart.json";
import { BackspaceIcon } from "@heroicons/react/24/solid";
import ScaleBox from "./components/ScaleBox";
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

  const themeOptions = [
    { value: "8008", label: "8008 Theme" },
    { value: "80s_after_dark", label: "80S After Dark Theme" },
    { value: "9009", label: "9009 Theme" },
    { value: "aether", label: "Aether Theme" },
    { value: "alduin", label: "Alduin Theme" },
    { value: "alpine", label: "Alpine Theme" },
    { value: "anti_hero", label: "Anti Hero Theme" },
    { value: "arch", label: "Arch Theme" },
    { value: "aurora", label: "Aurora Theme" },
    { value: "beach", label: "Beach Theme" },
    { value: "bento", label: "Bento Theme" },
    { value: "bingsu", label: "Bingsu Theme" },
    { value: "bliss", label: "Bliss Theme" },
    { value: "blueberry_dark", label: "Blueberry Dark Theme" },
    { value: "blueberry_light", label: "Blueberry Light Theme" },
    { value: "blue_dolphin", label: "Blue Dolphin Theme" },
    { value: "botanical", label: "Botanical Theme" },
    { value: "bouquet", label: "Bouquet Theme" },
    { value: "breeze", label: "Breeze Theme" },
    { value: "bushido", label: "Bushido Theme" },
    { value: "cafe", label: "Cafe Theme" },
    { value: "camping", label: "Camping Theme" },
    { value: "carbon", label: "Carbon Theme" },
    { value: "catppuccin", label: "Catppuccin Theme" },
    { value: "chaos_theory", label: "Chaos Theory Theme" },
    { value: "cheesecake", label: "Cheesecake Theme" },
    { value: "cherry_blossom", label: "Cherry Blossom Theme" },
    { value: "comfy", label: "Comfy Theme" },
    { value: "copper", label: "Copper Theme" },
    { value: "creamsicle", label: "Creamsicle Theme" },
    { value: "cyberspace", label: "Cyberspace Theme" },
    { value: "cy_red", label: "Cy Red Theme" },
    { value: "dark", label: "Dark Theme" },
    { value: "dark_magic_girl", label: "Dark Magic Girl Theme" },
    { value: "dark_note", label: "Dark Note Theme" },
    { value: "darling", label: "Darling Theme" },
    { value: "deku", label: "Deku Theme" },
    { value: "desert_oasis", label: "Desert Oasis Theme" },
    { value: "dev", label: "Dev Theme" },
    { value: "diner", label: "Diner Theme" },
    { value: "dino", label: "Dino Theme" },
    { value: "discord", label: "Discord Theme" },
    { value: "dmg", label: "Dmg Theme" },
    { value: "dollar", label: "Dollar Theme" },
    { value: "dots", label: "Dots Theme" },
    { value: "dracula", label: "Dracula Theme" },
    { value: "drowning", label: "Drowning Theme" },
    { value: "dualshot", label: "Dualshot Theme" },
    { value: "earthsong", label: "Earthsong Theme" },
    { value: "everblush", label: "Everblush Theme" },
    { value: "evil_eye", label: "Evil Eye Theme" },
    { value: "ez_mode", label: "Ez Mode Theme" },
    { value: "fire", label: "Fire Theme" },
    { value: "fledgling", label: "Fledgling Theme" },
    { value: "fleuriste", label: "Fleuriste Theme" },
    { value: "floret", label: "Floret Theme" },
    { value: "froyo", label: "Froyo Theme" },
    { value: "frozen_llama", label: "Frozen Llama Theme" },
    { value: "fruit_chew", label: "Fruit Chew Theme" },
    { value: "fundamentals", label: "Fundamentals Theme" },
    { value: "future_funk", label: "Future Funk Theme" },
    { value: "github", label: "Github Theme" },
    { value: "godspeed", label: "Godspeed Theme" },
    { value: "graen", label: "Graen Theme" },
    { value: "grand_prix", label: "Grand Prix Theme" },
    { value: "grape", label: "Grape Theme" },
    { value: "gruvbox_dark", label: "Gruvbox Dark Theme" },
    { value: "gruvbox_light", label: "Gruvbox Light Theme" },
    { value: "hammerhead", label: "Hammerhead Theme" },
    { value: "hanok", label: "Hanok Theme" },
    { value: "hedge", label: "Hedge Theme" },
    { value: "honey", label: "Honey Theme" },
    { value: "horizon", label: "Horizon Theme" },
    { value: "husqy", label: "Husqy Theme" },
    { value: "iceberg_dark", label: "Iceberg Dark Theme" },
    { value: "iceberg_light", label: "Iceberg Light Theme" },
    { value: "incognito", label: "Incognito Theme" },
    { value: "ishtar", label: "Ishtar Theme" },
    { value: "iv_clover", label: "Iv Clover Theme" },
    { value: "iv_spade", label: "Iv Spade Theme" },
    { value: "joker", label: "Joker Theme" },
    { value: "laser", label: "Laser Theme" },
    { value: "lavender", label: "Lavender Theme" },
    { value: "leather", label: "Leather Theme" },
    { value: "lilac_mist", label: "Lilac Mist Theme" },
    { value: "lil_dragon", label: "Lil Dragon Theme" },
    { value: "lime", label: "Lime Theme" },
    { value: "luna", label: "Luna Theme" },
    { value: "macroblank", label: "Macroblank Theme" },
    { value: "magic_girl", label: "Magic Girl Theme" },
    { value: "mashu", label: "Mashu Theme" },
    { value: "matcha_moccha", label: "Matcha Moccha Theme" },
    { value: "material", label: "Material Theme" },
    { value: "matrix", label: "Matrix Theme" },
    { value: "menthol", label: "Menthol Theme" },
    { value: "metaverse", label: "Metaverse Theme" },
    { value: "metropolis", label: "Metropolis Theme" },
    { value: "mexican", label: "Mexican Theme" },
    { value: "miami", label: "Miami Theme" },
    { value: "miami_nights", label: "Miami Nights Theme" },
    { value: "midnight", label: "Midnight Theme" },
    { value: "milkshake", label: "Milkshake Theme" },
    { value: "mint", label: "Mint Theme" },
    { value: "mizu", label: "Mizu Theme" },
    { value: "modern_dolch", label: "Modern Dolch Theme" },
    { value: "modern_dolch_light", label: "Modern Dolch Light Theme" },
    { value: "modern_ink", label: "Modern Ink Theme" },
    { value: "monokai", label: "Monokai Theme" },
    { value: "moonlight", label: "Moonlight Theme" },
    { value: "mountain", label: "Mountain Theme" },
    { value: "mr_sleeves", label: "Mr Sleeves Theme" },
    { value: "ms_cupcakes", label: "Ms Cupcakes Theme" },
    { value: "muted", label: "Muted Theme" },
    { value: "nautilus", label: "Nautilus Theme" },
    { value: "nebula", label: "Nebula Theme" },
    { value: "night_runner", label: "Night Runner Theme" },
    { value: "nord", label: "Nord Theme" },
    { value: "nord_light", label: "Nord Light Theme" },
    { value: "norse", label: "Norse Theme" },
    { value: "oblivion", label: "Oblivion Theme" },
    { value: "olive", label: "Olive Theme" },
    { value: "olivia", label: "Olivia Theme" },
    { value: "onedark", label: "Onedark Theme" },
    { value: "our_theme", label: "Our Theme Theme" },
    { value: "paper", label: "Paper Theme" },
    { value: "passion_fruit", label: "Passion Fruit Theme" },
    { value: "pastel", label: "Pastel Theme" },
    { value: "peaches", label: "Peaches Theme" },
    { value: "peach_blossom", label: "Peach Blossom Theme" },
    { value: "pink_lemonade", label: "Pink Lemonade Theme" },
    { value: "pulse", label: "Pulse Theme" },
    { value: "purpleish", label: "Purpleish Theme" },
    { value: "rainbow_trail", label: "Rainbow Trail Theme" },
    { value: "red_dragon", label: "Red Dragon Theme" },
    { value: "red_samurai", label: "Red Samurai Theme" },
    { value: "repose_dark", label: "Repose Dark Theme" },
    { value: "repose_light", label: "Repose Light Theme" },
    { value: "retro", label: "Retro Theme" },
    { value: "retrocast", label: "Retrocast Theme" },
    { value: "rgb", label: "Rgb Theme" },
    { value: "rose_pine", label: "Rose Pine Theme" },
    { value: "rose_pine_dawn", label: "Rose Pine Dawn Theme" },
    { value: "rose_pine_moon", label: "Rose Pine Moon Theme" },
    { value: "rudy", label: "Rudy Theme" },
    { value: "ryujinscales", label: "Ryujinscales Theme" },
    { value: "serika", label: "Serika Theme" },
    { value: "serika_dark", label: "Serika Dark Theme" },
    { value: "sewing_tin", label: "Sewing Tin Theme" },
    { value: "shadow", label: "Shadow Theme" },
    { value: "shoko", label: "Shoko Theme" },
    { value: "slambook", label: "Slambook Theme" },
    { value: "snes", label: "Snes Theme" },
    { value: "soaring_skies", label: "Soaring Skies Theme" },
    { value: "solarized_dark", label: "Solarized Dark Theme" },
    { value: "solarized_light", label: "Solarized Light Theme" },
    { value: "sonokai", label: "Sonokai Theme" },
    { value: "stealth", label: "Stealth Theme" },
    { value: "strawberry", label: "Strawberry Theme" },
    { value: "striker", label: "Striker Theme" },
    { value: "suisei", label: "Suisei Theme" },
    { value: "superuser", label: "Superuser Theme" },
    { value: "sweden", label: "Sweden Theme" },
    { value: "tangerine", label: "Tangerine Theme" },
    { value: "taro", label: "Taro Theme" },
    { value: "terminal", label: "Terminal Theme" },
    { value: "terra", label: "Terra Theme" },
    { value: "terrazzo", label: "Terrazzo Theme" },
    { value: "terror_below", label: "Terror Below Theme" },
    { value: "tiramisu", label: "Tiramisu Theme" },
    { value: "trackday", label: "Trackday Theme" },
    { value: "trance", label: "Trance Theme" },
    { value: "tron_orange", label: "Tron Orange Theme" },
    { value: "vaporwave", label: "Vaporwave Theme" },
    { value: "viridescent", label: "Viridescent Theme" },
    { value: "voc", label: "Voc Theme" },
    { value: "vscode", label: "Vscode Theme" },
    { value: "watermelon", label: "Watermelon Theme" },
    { value: "wavez", label: "Wavez Theme" },
    { value: "witch_girl", label: "Witch Girl Theme" },
  ];

  return (
    <div className="min-h-screen flex flex-col gap-4">
      <div className="w-full flex-1 flex-col gap-4 h-screen mx-auto">
        <div className="px-[2%] sticky backdrop-blur-md -top-[10.6rem] sm:-top-[8rem] xl:-top-14 z-10 mx-auto w-full h-full grid grid-cols-12 gap-2 font-medium py-2 sm:py-4">
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
