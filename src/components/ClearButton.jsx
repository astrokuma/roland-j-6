import React from "react";
import { BackspaceIcon } from "@heroicons/react/24/solid";

const ClearButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="col-span-4 py-2 bg-secondary-200 text-secondary-600 font-semibold rounded-md flex flex-row items-center justify-center gap-1 h-28"
  >
    <BackspaceIcon className="w-8" />
  </button>
);

export default ClearButton;
