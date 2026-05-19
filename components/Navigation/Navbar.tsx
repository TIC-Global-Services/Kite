import React from "react";
import PrimaryButton from "../Reusable/PrimaryButton";
import DotIcon from "../Reusable/Icons/DotIcon";

const Navbar = () => {
  return (
    <div className="fixed top-0 w-full min-h-[9dvh] flex items-center justify-between px-10 bg-background z-99 border-b border-gray">
      <div>
        <img src="/logo.png" alt="Kite AI Logo" className="w-16 h-16 object-contain" />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 cursor-pointer group">
          <DotIcon />

          <p className="transition-all duration-300 tracking-tighter group-hover:tracking-0 font-semibold font-ki">
            Talk to Kite
          </p>
        </div>

        <div className=" w-[2px] h-6 bg-primary"></div>

        <PrimaryButton href="/app" showIcon={false}>
          Get Started
        </PrimaryButton>
      </div>
    </div>
  );
};

export default Navbar;
