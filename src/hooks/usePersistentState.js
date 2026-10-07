import { useEffect, useState } from "react";
import { readStored, writeStored } from "../utils/storage";

const isPlainObject = (value) => value && typeof value === "object" && !Array.isArray(value);

/** useState that survives reloads. Stored objects are merged over the defaults so new settings get sane values. */
const usePersistentState = (key, defaultValue, initialOverride = null) => {
  const [value, setValue] = useState(() => {
    if (initialOverride !== null && initialOverride !== undefined) return initialOverride;
    const stored = readStored(key, defaultValue);
    return isPlainObject(defaultValue) && isPlainObject(stored) ? { ...defaultValue, ...stored } : stored;
  });

  useEffect(() => {
    writeStored(key, value);
  }, [key, value]);

  return [value, setValue];
};

export default usePersistentState;
