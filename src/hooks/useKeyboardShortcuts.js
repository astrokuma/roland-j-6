import { useEffect, useRef } from "react";

// Computer keys laid out like a piano: the home row is the white keys, the row above the black keys.
export const PIANO_KEYS = ["a", "w", "s", "e", "d", "f", "t", "g", "y", "h", "u", "j"];

export const SHORTCUTS = [
  { keys: "A W S E D F T G Y H U J", action: "Play J-6 keys C to B" },
  { keys: "← / →", action: "Previous / next chord set" },
  { keys: "Z / X", action: "Transpose down / up" },
  { keys: "Space", action: "Play / stop" },
  { keys: "Backspace", action: "Remove last step" },
  { keys: "Esc", action: "Close dialogs" },
];

const isTyping = (target) => target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

const useKeyboardShortcuts = (handlers, enabled = true) => {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!enabled) return undefined;
    const onKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat || isTyping(event.target)) return;
      const h = handlersRef.current;
      const key = event.key.toLowerCase();
      const pianoIndex = PIANO_KEYS.indexOf(key);

      if (pianoIndex !== -1) h.onPianoKey(pianoIndex + 1);
      else if (event.key === "ArrowLeft") h.onBank(-1);
      else if (event.key === "ArrowRight") h.onBank(1);
      else if (key === "z") h.onTranspose(-1);
      else if (key === "x") h.onTranspose(1);
      else if (event.key === " " && !(event.target instanceof HTMLButtonElement)) h.onPlayToggle();
      else if (event.key === "Backspace") h.onUndo();
      else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled]);
};

export default useKeyboardShortcuts;
