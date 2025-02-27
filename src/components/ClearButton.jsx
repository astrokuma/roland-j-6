import React from "react";
import { BackspaceIcon } from "@heroicons/react/24/solid";

const ClearButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="col-span-4 group py-2 bg-primary rounded-md flex flex-row items-center justify-center gap-1 h-28"
  >
    <BackspaceIcon className="w-8 text-accent font-semibold" />
  </button>
);

export default ClearButton;
