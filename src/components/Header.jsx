import React from "react";
import ColorModeToggle from "./ColorModeToggle";

const Header = () => (
  <div className="col-span-12 py-2 bg-primary text-accent text-lg leading-none font-black text-center rounded-lg">
    <p className="flex items-center justify-around">
      Roland J · 6
      <ColorModeToggle />
    </p>
  </div>
);

export default Header;
