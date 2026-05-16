import type { Metadata } from "next";
import "./globals.css";
import { Aeonik, Ki } from "@/fonts";
import Navbar from "@/components/Navigation/Navbar";
import Footer from "@/components/Navigation/Footer";
import { ToastProvider } from "@/components/Reusable/Toast";

export const metadata: Metadata = {
  title: "Kite AI",
  description:
    "Explore live AI experiences that gather signals from the web,organize what matters, and execute tasks autonomously on your behalf.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${Aeonik.variable} ${Ki.variable} h-full antialiased`}
    >
      <body>
        <ToastProvider>
          <Navbar />
          {children}
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
