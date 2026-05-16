import * as React from "react";

interface FineTuningSVGProps extends React.SVGProps<SVGSVGElement> {}

const FineTuningSVG: React.FC<FineTuningSVGProps> = (props) => (
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
        d="M32.5 11.667C33.6702 17.1609 33.6702 22.8397 32.5 28.3337"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-1"
      />
      <path
        d="M7.50073 11.667C6.33049 17.1609 6.33049 22.8397 7.50073 28.3337"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-2"
      />
      <path
        d="M11.666 32.5C17.1599 33.6702 22.8388 33.6702 28.3327 32.5"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-3"
      />
      <path
        d="M11.666 7.49975C17.1599 6.32951 22.8388 6.32951 28.3327 7.49975"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-4"
      />
      <path
        d="M35.0007 28.333H30.0007C29.0802 28.333 28.334 29.0792 28.334 29.9997V34.9997C28.334 35.9201 29.0802 36.6663 30.0007 36.6663H35.0007C35.9211 36.6663 36.6673 35.9201 36.6673 34.9997V29.9997C36.6673 29.0792 35.9211 28.333 35.0007 28.333Z"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-5"
      />
      <path
        d="M35.0007 3.33301H30.0007C29.0802 3.33301 28.334 4.0792 28.334 4.99967V9.99967C28.334 10.9201 29.0802 11.6663 30.0007 11.6663H35.0007C35.9211 11.6663 36.6673 10.9201 36.6673 9.99967V4.99967C36.6673 4.0792 35.9211 3.33301 35.0007 3.33301Z"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-6"
      />
      <path
        d="M10.0007 28.333H5.00065C4.08018 28.333 3.33398 29.0792 3.33398 29.9997V34.9997C3.33398 35.9201 4.08018 36.6663 5.00065 36.6663H10.0007C10.9211 36.6663 11.6673 35.9201 11.6673 34.9997V29.9997C11.6673 29.0792 10.9211 28.333 10.0007 28.333Z"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-7"
      />
      <path
        d="M10.0007 3.33301H5.00065C4.08018 3.33301 3.33398 4.0792 3.33398 4.99967V9.99967C3.33398 10.9201 4.08018 11.6663 5.00065 11.6663H10.0007C10.9211 11.6663 11.6673 10.9201 11.6673 9.99967V4.99967C11.6673 4.0792 10.9211 3.33301 10.0007 3.33301Z"
        stroke="#2C3B4E"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-elem-8"
      />
    </svg>
    <style jsx>
      {`
        svg .svg-elem-1 {
          stroke-dashoffset: 18.7896785736084px;
          stroke-dasharray: 18.7896785736084px;
          -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0s;
          transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0s;
        }
        svg.active .svg-elem-1 { stroke-dashoffset: 0; }

        svg .svg-elem-2 {
          stroke-dashoffset: 18.789684295654297px;
          stroke-dasharray: 18.789684295654297px;
          -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.12s;
          transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.12s;
        }
        svg.active .svg-elem-2 { stroke-dashoffset: 0; }

        svg .svg-elem-3 {
          stroke-dashoffset: 18.7896785736084px;
          stroke-dasharray: 18.7896785736084px;
          -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.24s;
          transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.24s;
        }
        svg.active .svg-elem-3 { stroke-dashoffset: 0; }

        svg .svg-elem-4 {
          stroke-dashoffset: 18.78968620300293px;
          stroke-dasharray: 18.78968620300293px;
          -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.36s;
          transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.36s;
        }
        svg.active .svg-elem-4 { stroke-dashoffset: 0; }

        svg .svg-elem-5 {
          stroke-dashoffset: 32.473337173461914px;
          stroke-dasharray: 32.473337173461914px;
          -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.48s;
          transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.48s;
        }
        svg.active .svg-elem-5 { stroke-dashoffset: 0; }

        svg .svg-elem-6 {
          stroke-dashoffset: 32.47332000732422px;
          stroke-dasharray: 32.47332000732422px;
          -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.6s;
          transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.6s;
        }
        svg.active .svg-elem-6 { stroke-dashoffset: 0; }

        svg .svg-elem-7 {
          stroke-dashoffset: 32.47337532043457px;
          stroke-dasharray: 32.47337532043457px;
          -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.72s;
          transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.72s;
        }
        svg.active .svg-elem-7 { stroke-dashoffset: 0; }

        svg .svg-elem-8 {
          stroke-dashoffset: 32.47336006164551px;
          stroke-dasharray: 32.47336006164551px;
          -webkit-transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.84s;
          transition: stroke-dashoffset 1s cubic-bezier(0.47, 0, 0.745, 0.715) 0.84s;
        }
        svg.active .svg-elem-8 { stroke-dashoffset: 0; }
      `}
    </style>
  </>
);
export default FineTuningSVG;
