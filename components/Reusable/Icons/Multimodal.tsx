import * as React from "react";

interface MultimodalSVGProps extends React.SVGProps<SVGSVGElement> {}

const MultimodalSVG: React.FC<MultimodalSVGProps> = (props) => (
  <>
    <svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.33398 11.667V28.3337"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-1"
      />
      <path
        d="M10 8.33301V31.6663"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-2"
      />
      <path
        d="M33.3327 5H19.9993C18.1584 5 16.666 6.49238 16.666 8.33333V31.6667C16.666 33.5076 18.1584 35 19.9993 35H33.3327C35.1736 35 36.666 33.5076 36.666 31.6667V8.33333C36.666 6.49238 35.1736 5 33.3327 5Z"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-3"
      />
    </svg>
    <style jsx>{`
      svg .svg-elem-1 {
        stroke-dashoffset: 18.66670036315918px;
        stroke-dasharray: 18.66670036315918px;
        -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0s;
        transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0s;
      }
      svg.active .svg-elem-1 { stroke-dashoffset: 0; }

      svg .svg-elem-2 {
        stroke-dashoffset: 25.333290100097656px;
        stroke-dasharray: 25.333290100097656px;
        -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.12s;
        transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.12s;
      }
      svg.active .svg-elem-2 { stroke-dashoffset: 0; }

      svg .svg-elem-3 {
        stroke-dashoffset: 96.28028106689453px;
        stroke-dasharray: 96.28028106689453px;
        -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.24s;
        transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.24s;
      }
      svg.active .svg-elem-3 { stroke-dashoffset: 0; }
    `}</style>
  </>
);
export default MultimodalSVG;
