import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import StepperSelect from "./StepperSelect";

const ThemeSelector = ({ themes = [] }) => {
  const { themeName, switchTheme } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(() => themes.findIndex((t) => t.value === themeName));

  useEffect(() => {
    const newIndex = themes.findIndex((t) => t.value === themeName);
    if (newIndex !== -1) setSelectedIndex(newIndex);
  }, [themeName, themes]);

  const handleChange = (theme) => {
    switchTheme(theme.value);
  };

  return (
    <StepperSelect
      items={themes}
      selectedIndex={selectedIndex}
      onChange={handleChange}
      valueKey="value"
      labelKey="label"
    />
  );
};

export default ThemeSelector;
