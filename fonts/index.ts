import localFont from "next/font/local";

export const Aeonik = localFont({
  src: [
    {
      path: "./Aeonik/Aeonik-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Aeonik/Aeonik-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-aeonik",
  display: "swap",
});

export const Ki = localFont({
  src: [
    {
      path: "./Ki/ki.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-ki",
  display: "swap",
});
