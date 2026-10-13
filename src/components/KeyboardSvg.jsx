import React from "react";

const WHITE_CHROMAS = [0, 2, 4, 5, 7, 9, 11];
const BLACK_KEYS = [
  { chroma: 1, after: 1 },
  { chroma: 3, after: 2 },
  { chroma: 6, after: 4 },
  { chroma: 8, after: 5 },
  { chroma: 10, after: 6 },
];
const W = 10;
const H = 40;
const BW = 6.4;
const BH = 25;

const FILL = {
  root: "fill-tertiary",
  tone: "fill-accent",
  scale: "fill-secondary",
};

/**
 * Piano drawn as SVG so it scales with its container (no CSS transform hacks).
 * keyState(midi) returns "root" | "tone" | "scale" | null; markers puts a dot on a key (used for the bass note).
 */
const KeyboardSvg = ({ startOctave, octaves, keyState, markers = [], labelOctaves = false, className = "" }) => {
  const width = octaves * 7 * W;
  const height = H + (labelOctaves ? 9 : 0);
  const keys = [];

  for (let o = 0; o < octaves; o++) {
    const octave = startOctave + o;
    const baseMidi = (octave + 1) * 12;
    WHITE_CHROMAS.forEach((chroma, i) => {
      const midi = baseMidi + chroma;
      const state = keyState(midi);
      const x = (o * 7 + i) * W;
      keys.push(
        <rect
          key={`w${midi}`}
          x={x + 0.5}
          y={0.5}
          width={W - 1}
          height={H - 1}
          rx={1.5}
          className={`${FILL[state] ?? "fill-notes"} stroke-primary`}
          strokeWidth={1}
        />,
      );
      if (markers.includes(midi)) keys.push(<circle key={`m${midi}`} cx={x + W / 2} cy={H - 6} r={2.2} className="fill-primary" />);
      if (labelOctaves && chroma === 0) {
        keys.push(
          <text key={`l${midi}`} x={x + W / 2} y={H + 7.5} textAnchor="middle" className="fill-accent" style={{ fontSize: 6.5, fontWeight: 700 }}>
            C{octave}
          </text>,
        );
      }
    });
  }

  for (let o = 0; o < octaves; o++) {
    const baseMidi = (startOctave + o + 1) * 12;
    BLACK_KEYS.forEach(({ chroma, after }) => {
      const midi = baseMidi + chroma;
      const state = keyState(midi);
      const x = (o * 7 + after) * W - BW / 2;
      keys.push(
        <rect
          key={`b${midi}`}
          x={x}
          y={0}
          width={BW}
          height={BH}
          rx={1}
          className={`${FILL[state] ?? "fill-primary"} stroke-primary`}
          strokeWidth={1}
        />,
      );
      if (markers.includes(midi)) keys.push(<circle key={`m${midi}`} cx={x + BW / 2} cy={BH - 5} r={1.8} className="fill-primary" />);
    });
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`w-full h-auto ${className}`}
      aria-hidden="true"
    >
      {keys}
    </svg>
  );
};

export default KeyboardSvg;
