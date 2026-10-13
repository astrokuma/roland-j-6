import React from "react";
import { ArrowDownIcon, ArrowUpIcon, ArrowsUpDownIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import Modal from "./Modal";
import { Panel, Segmented, Slider } from "./controls";
import { PLAY_MODES } from "../audio/engine";

const STEP_LENGTH_OPTIONS = [
  { id: "1m", label: "1 bar" },
  { id: "2n", label: "½ bar" },
  { id: "4n", label: "1 beat" },
];

const ARP_DIRECTIONS = [
  { id: "up", label: <ArrowUpIcon className="w-4 h-4 mx-auto" />, name: "Up" },
  { id: "down", label: <ArrowDownIcon className="w-4 h-4 mx-auto" />, name: "Down" },
  { id: "upDown", label: <ArrowsUpDownIcon className="w-4 h-4 mx-auto" />, name: "Up and down" },
  { id: "random", label: <QuestionMarkCircleIcon className="w-4 h-4 mx-auto" />, name: "Random" },
];

const ARP_RATES = [
  { id: "4n", label: "1/4" },
  { id: "8n", label: "1/8" },
  { id: "16n", label: "1/16" },
];

const SequenceModal = ({ isOpen, onClose, sequence, setSequence, bpm, setBpm }) => {
  const set = (key) => (value) => setSequence((prev) => ({ ...prev, [key]: value }));
  const usesGrid = sequence.mode !== "pad";

  const toggleBeat = (index) => set("pattern")(sequence.pattern.map((on, i) => (i === index ? !on : on)));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sequence"
    >
      <div className="space-y-4">
        <Panel>
          <Slider
            label="Tempo"
            value={bpm}
            onChange={setBpm}
            min={40}
            max={200}
            step={1}
            format={(v) => `${v} BPM`}
          />
          <div>
            <p className="text-xs font-bold text-secondary uppercase mb-1">Step length</p>
            <Segmented
              label="Step length"
              options={STEP_LENGTH_OPTIONS}
              value={sequence.stepLength}
              onChange={set("stepLength")}
            />
          </div>
          <div>
            <p className="text-xs font-bold text-secondary uppercase mb-1">Play mode</p>
            <Segmented
              label="Play mode"
              options={PLAY_MODES}
              value={sequence.mode}
              onChange={set("mode")}
            />
            <p className="text-xs text-accent mt-2">{PLAY_MODES.find((m) => m.id === sequence.mode)?.title}. Use HOLD steps to let a chord ring longer.</p>
          </div>
        </Panel>

        <div className={`space-y-4 transition-opacity ${usesGrid ? "" : "opacity-40 pointer-events-none"}`}>
          <Panel title="Rhythm grid (1 bar)">
            <div className="grid grid-cols-4 gap-2">
              {sequence.pattern.map((isActive, i) => (
                <button
                  key={i}
                  onClick={() => toggleBeat(i)}
                  aria-pressed={isActive}
                  aria-label={`Beat ${i + 1}`}
                  className={`h-12 rounded-md font-black transition-all border-2 ${isActive ? "bg-accent border-accent text-primary" : "bg-transparent border-accent/40 text-accent/60"}`}
                >
                  {isActive ? i + 1 : "–"}
                </button>
              ))}
            </div>
            <Slider
              label="Gate"
              value={sequence.gate}
              onChange={set("gate")}
              min={0.1}
              max={1.5}
              step={0.05}
              format={(v) => `${Math.round(v * 100)}%`}
            />
          </Panel>
        </div>

        <div className={`transition-opacity ${sequence.mode === "arp" ? "" : "opacity-40 pointer-events-none"}`}>
          <Panel title="Arpeggio">
            <div>
              <p className="text-xs font-bold text-secondary uppercase mb-1">Direction</p>
              <Segmented
                label="Arpeggio direction"
                options={ARP_DIRECTIONS}
                value={sequence.arpDirection}
                onChange={set("arpDirection")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-secondary uppercase mb-1">Range</p>
                <Segmented
                  label="Arpeggio range"
                  options={[1, 2, 3].map((o) => ({ id: o, label: `${o} oct` }))}
                  value={sequence.arpOctaves}
                  onChange={set("arpOctaves")}
                />
              </div>
              <div>
                <p className="text-xs font-bold text-secondary uppercase mb-1">Rate</p>
                <Segmented
                  label="Arpeggio rate"
                  options={ARP_RATES}
                  value={sequence.arpRate}
                  onChange={set("arpRate")}
                />
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </Modal>
  );
};

export default SequenceModal;
