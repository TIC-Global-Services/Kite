"use client";

import React from "react";

const DotIcon = () => {
  return (
    <div className="relative w-5 h-5 animate-orbit">
      <span className="dot top-0 left-0" />
      <span className="dot top-0 right-0" />
      <span className="dot bottom-0 left-0" />
      <span className="dot bottom-0 right-0" />
    </div>
  );
};

export default DotIcon;