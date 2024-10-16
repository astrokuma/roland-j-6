import React from "react";

const Footer = () => {
  return (
    <div className="text-neutral-400 text-sm w-full gap-8 flex items-center justify-center bg-sky-950 py-4">
      <a
        href="https://ko-fi.com/astrokuma"
        target="_blank"
        rel="noopener noreferrer"
        className=" text-neutral-200 hover:text-neutral-100"
      >
        Donate ♡
      </a>
      © 2024 Astro-Kuma. All rights reserved.
    </div>
  );
};

export default Footer;
