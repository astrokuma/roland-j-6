# Roland J-6 Chord Companion

A companion app for the Roland AIRA Compact J-6. The J-6 has 100 chord sets of 12 chords each, but it only shows a chord set number, and with 4-voice polyphony many chords are voiced with notes left out. This app shows what each key actually plays.

## Features

- **All 100 chord sets** from Roland's J-6 Chord Set List, laid out by J-6 key (C to B).
- **Real voicings.** Each chord shows its four notes low to high with octave numbers, their role (root, 3, b7, 9…), the bass note, and the chord tones the J-6 voicing leaves out (for example, FM9 is F A E G with no C).
- **Corrections to Roland's list.** Where a chord name and its notes disagree in Roland's list, the card says so.
- **Step sequencer modelled on the J-6.** Up to 64 steps, shown 8 to a page, with REC, HOLD (tie) and REST. Chords can repeat, and steps can be moved or deleted.
- **Playback** in three modes: PAD (sustained), RHY (rhythm grid) and ARP (arpeggio). The playing chord lights up.
- **Transpose** (the J-6 KEY function), from -12 to +12 semitones.
- **Scale suggestions** for the chords in your sequence, across all 12 roots. Modes that share the same notes are grouped, and "Show chords that fit" dims the chords outside a scale.
- **Chord set search** by genre, chord name (`Dm9`) or notes (`C E G`).
- **Shareable links.** The URL always holds the current chord set, transpose and sequence.
- **Juno-style sound** with filter, envelope, chorus I/II, delay, reverb and presets.
- **Keyboard shortcuts.** `A W S E D F T G Y H U J` play the 12 keys, `←/→` change chord set, `Z/X` transpose, `Space` plays or stops, `Backspace` removes the last step.
- **Phone support**, including swipe to change chord set. Works offline once loaded (PWA). 10 themes, each with light and dark modes.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run lint
npm run build
npm run deploy   # build and publish to GitHub Pages
```

## Where things live

| Path | What it holds |
| --- | --- |
| `src/ChordChart.json` | The chord data, checked against Roland's J-6 Chord Set List. `analyzeAs` and `remark` mark chords whose name and notes disagree in Roland's list. |
| `src/utils/chordTheory.js` | Parses J-6 chord names, labels each note's role in the chord, finds the notes a voicing leaves out, and transposes chords. |
| `src/utils/scales.js` | Finds and ranks the scales that fit a sequence. |
| `src/audio/engine.js` | The single Tone.js engine (synth, effects, sequencer). There must be only one; a second engine doubles every note. |
| `src/audio/timeline.js` | Turns sequencer steps into timed events (no Tone.js dependency). |
| `src/hooks/useProgression.js` | Chord set, transpose and steps, saved to localStorage and the URL. |
| `src/themes/*.css` | Theme colours, scoped by `[data-theme][data-color-mode]`. |

## Reference

- [J-6 Owner's Manual](https://static.roland.com/manuals/J-6_manual_v102/eng/index.html)
- [J-6 Chord Set List](https://static.roland.com/manuals/J-6_manual_v102/eng/28645807.html)
