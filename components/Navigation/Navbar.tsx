"use client";

import React, { useState } from "react";
import PrimaryButton from "../Reusable/PrimaryButton";
import DotIcon from "../Reusable/Icons/DotIcon";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 w-full min-h-[9dvh] flex items-center justify-between px-6 md:px-10 bg-background z-99 border-b border-gray">
        {/* Logo */}
        <div>
          <img src="/logo.png" alt="Kite AI Logo" className="w-16 h-16 object-contain" />
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer group">
            <DotIcon />
            <p className="transition-all duration-300 tracking-tighter group-hover:tracking-0 font-semibold font-ki">
              Talk to Kite
            </p>
          </div>
          <div className="w-[2px] h-6 bg-primary" />
          <PrimaryButton href="/app" showIcon={false}>
            Get Started
          </PrimaryButton>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 cursor-pointer"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block h-[2px] bg-primary transition-all duration-300 ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block h-[2px] bg-primary transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block h-[2px] bg-primary transition-all duration-300 ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed top-[9dvh] left-0 w-full bg-background border-b border-gray z-98 flex flex-col gap-6 px-6 py-8 md:hidden transition-all duration-300 ease-in-out ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setOpen(false)}>
          <DotIcon />
          <p className="transition-all duration-300 tracking-tighter group-hover:tracking-0 font-semibold font-ki">
            Talk to Kite
          </p>
        </div>
        <div className="h-[1px] w-full bg-gray" />
        <PrimaryButton href="/app" showIcon={false} className="w-full justify-center">
          Get Started
        </PrimaryButton>
      </div>
    </>
  );
};

export default Navbar;
