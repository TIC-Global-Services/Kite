import * as React from "react";

interface CloudSVGProps extends React.SVGProps<SVGSVGElement> {}

const CloudSVG: React.FC<CloudSVGProps> = (props) => (
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
        d="M4.95065 21.5333C4.45858 21.829 4.0512 22.2467 3.76796 22.746C3.48473 23.2453 3.33524 23.8093 3.33398 24.3833V29.7833C3.33524 30.3574 3.48473 30.9214 3.76796 31.4207C4.0512 31.92 4.45858 32.3377 4.95065 32.6333L9.95065 35.6333C10.4691 35.9448 11.0625 36.1094 11.6673 36.1094C12.2721 36.1094 12.8655 35.9448 13.384 35.6333L20.0007 31.6667V22.5L11.6673 17.5L4.95065 21.5333Z"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-1"
      />
      <path
        d="M11.6676 27.5L3.76758 22.75"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-2"
      />
      <path
        d="M11.666 27.5L19.9993 22.5"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-3"
      />
      <path
        d="M11.666 27.5V36.1167"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-4"
      />
      <path
        d="M20 22.5V31.6667L26.6167 35.6333C27.1351 35.9448 27.7285 36.1094 28.3333 36.1094C28.9381 36.1094 29.5316 35.9448 30.05 35.6333L35.05 32.6333C35.5421 32.3377 35.9495 31.92 36.2327 31.4207C36.5159 30.9214 36.6654 30.3574 36.6667 29.7833V24.3833C36.6654 23.8093 36.5159 23.2453 36.2327 22.746C35.9495 22.2467 35.5421 21.829 35.05 21.5333L28.3333 17.5L20 22.5Z"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-5"
      />
      <path
        d="M28.3333 27.5L20 22.5"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-6"
      />
      <path
        d="M28.334 27.5L36.234 22.75"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-7"
      />
      <path
        d="M28.334 27.5V36.1167"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-8"
      />
      <path
        d="M13.2827 7.36666C12.7906 7.66229 12.3832 8.07999 12.1 8.5793C11.8168 9.07862 11.6673 9.64261 11.666 10.2167V17.5L19.9993 22.5L28.3327 17.5V10.2167C28.3314 9.64261 28.1819 9.07862 27.8987 8.5793C27.6155 8.07999 27.2081 7.66229 26.716 7.36666L21.716 4.36666C21.1976 4.05518 20.6042 3.89062 19.9993 3.89062C19.3945 3.89062 18.8011 4.05518 18.2827 4.36666L13.2827 7.36666Z"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-9"
      />
      <path
        d="M19.9996 13.333L12.0996 8.58301"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-10"
      />
      <path
        d="M20 13.333L27.9 8.58301"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-11"
      />
      <path
        d="M20 22.4997V13.333"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-12"
      />
    </svg>
    <style jsx>{`
      svg .svg-elem-1 {
        stroke-dashoffset: 58.12258529663086px;
        stroke-dasharray: 58.12258529663086px;
        -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0s;
        transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0s;
      }
      svg.active .svg-elem-1 { stroke-dashoffset: 0; }

      svg .svg-elem-2 {
        stroke-dashoffset: 11.218070030212402px;
        stroke-dasharray: 11.218070030212402px;
        -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.12s;
        transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.12s;
      }
      svg.active .svg-elem-2 { stroke-dashoffset: 0; }

      svg .svg-elem-3 {
        stroke-dashoffset: 11.71822452545166px;
        stroke-dasharray: 11.71822452545166px;
        -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.24s;
        transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.24s;
      }
      svg.active .svg-elem-3 { stroke-dashoffset: 0; }

      svg .svg-elem-4 {
        stroke-dashoffset: 10.61669921875px;
        stroke-dasharray: 10.61669921875px;
        -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.36s;
        transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.36s;
      }
      svg.active .svg-elem-4 { stroke-dashoffset: 0; }

      svg .svg-elem-5 {
        stroke-dashoffset: 58.122528076171875px;
        stroke-dasharray: 58.122528076171875px;
        -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.48s;
        transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.48s;
      }
      svg.active .svg-elem-5 { stroke-dashoffset: 0; }

      svg .svg-elem-6 {
        stroke-dashoffset: 11.71822452545166px;
        stroke-dasharray: 11.71822452545166px;
        -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.6s;
        transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.6s;
      }
      svg.active .svg-elem-6 { stroke-dashoffset: 0; }

      svg .svg-elem-7 {
        stroke-dashoffset: 11.218053817749023px;
        stroke-dasharray: 11.218053817749023px;
        -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.72s;
        transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.72s;
      }
      svg.active .svg-elem-7 { stroke-dashoffset: 0; }

      svg .svg-elem-8 {
        stroke-dashoffset: 10.61669921875px;
        stroke-dasharray: 10.61669921875px;
        -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.84s;
        transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.84s;
      }
      svg.active .svg-elem-8 { stroke-dashoffset: 0; }

      svg .svg-elem-9 {
        stroke-dashoffset: 58.12251281738281px;
        stroke-dasharray: 58.12251281738281px;
        -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.96s;
        transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.96s;
      }
      svg.active .svg-elem-9 { stroke-dashoffset: 0; }

      svg .svg-elem-10 {
        stroke-dashoffset: 11.218048095703125px;
        stroke-dasharray: 11.218048095703125px;
        -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 1.08s;
        transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 1.08s;
      }
      svg.active .svg-elem-10 { stroke-dashoffset: 0; }

      svg .svg-elem-11 {
        stroke-dashoffset: 11.218048095703125px;
        stroke-dasharray: 11.218048095703125px;
        -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 1.2s;
        transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 1.2s;
      }
      svg.active .svg-elem-11 { stroke-dashoffset: 0; }

      svg .svg-elem-12 {
        stroke-dashoffset: 11.16670036315918px;
        stroke-dasharray: 11.16670036315918px;
        -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 1.32s;
        transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 1.32s;
      }
      svg.active .svg-elem-12 { stroke-dashoffset: 0; }
    `}</style>
  </>
);
export default CloudSVG;
