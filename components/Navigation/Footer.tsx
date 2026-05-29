"use client";

import {
  FaXTwitter as XTwitter,
  FaFacebookF as Facebook,
  FaInstagram as Instagram,
} from "react-icons/fa6";
import Image from "next/image";
import ContainerLayout from "../Layout/ContainerLayout";

const legal = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms-and-conditions" },
  { name: "Blogs", href: "/blogs" },
];

const social = [
  { name: "Twitter / X", href: "https://twitter.com/kite_ai", Icon: XTwitter },
  { name: "Facebook", href: "https://www.facebook.com/kiteai", Icon: Facebook },
  { name: "Instagram", href: "https://www.instagram.com/kiteai", Icon: Instagram },
];

const Footer = () => {
  return (
    <footer className="w-full bg-primary text-background">
      <ContainerLayout disablePaddingY className="border-x border-gray">

        {/* ── Mobile layout ── */}
        <div className="md:hidden border-x border-gray">

          {/* Wave */}
          <div className="bg-black border-b border-gray relative overflow-hidden" style={{ height: "40dvh" }}>
            <Image src="/assets/gif/loop3.gif" alt="Kite" fill className="object-cover" unoptimized />
          </div>

          {/* Kite brand */}
          <div className="relative border-b border-gray" style={{ height: "35dvh" }}>
            <Image src="/logo_white.svg" alt="Kite" fill className="object-contain p-8" />
          </div>

          {/* Policies + Connect */}
          <div className="grid grid-cols-2 border-b border-gray">
            <div className="p-6 border-r border-gray space-y-4">
              <p className="text-[#ff6b00] text-xl">Policies</p>
              <ul className="space-y-2">
                {legal.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="font-ki text-background/70 hover:text-background text-sm transition-colors duration-200">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 space-y-3 flex flex-col items-end">
              <p className="text-[#ff6b00] text-xl">Connect</p>
              <p className="font-ki text-background/60 text-sm text-right">
                Day or night, we love to hear you talk!
              </p>
              <div className="flex items-center gap-3 pt-1">
                {social.map(({ name, href, Icon }) => (
                  <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name}
                    className="w-10 h-10 rounded-full border border-background/30 flex items-center justify-center bg-background text-foreground transition-all duration-200">
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ── Desktop layout ── */}
        <div className="hidden md:grid grid-cols-3 min-h-[60dvh] border-t border-x border-gray pt-14">

          {/* Col 1: wave + policies */}
          <div className="flex flex-col border-r border-t border-gray">
            <div className="relative overflow-hidden border-b border-gray flex-1">
              <Image src="/assets/gif/loop3.gif" alt="Kite" fill className="object-cover" unoptimized />
            </div>
            <div className="p-10 space-y-4">
              <p className="text-[#ff6b00] text-xl">Policies</p>
              <ul className="space-y-2">
                {legal.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="font-ki text-background/70 hover:text-background text-lg transition-colors duration-200">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col 2: Kite logo */}
          <div className="relative border-r border-t border-gray overflow-hidden">
            <Image src="/logo_white.svg" alt="Kite" fill className="object-contain p-10" />
          </div>

          {/* Col 3: connect + wave */}
          <div className="flex flex-col border-t  border-gray">
            <div className="p-10 space-y-3 border-b border-gray">
              <p className="text-[#ff6b00] text-xl">Connect</p>
              <p className="text-background/60 font-ki text-base">
                Day or night, we love <br />to hear you talk!
              </p>
              <div className="flex items-center gap-3">
                {social.map(({ name, href, Icon }) => (
                  <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name}
                    className="w-10 h-10 rounded-full border border-gray flex items-center justify-center bg-background text-foreground transition-all duration-200">
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>
            <div className="flex-1 relative overflow-hidden">
              <Image src="/assets/gif/loop3.gif" alt="Kite" fill className="object-cover" unoptimized />
            </div>
          </div>

        </div>

        {/* ── Copyright bar ── */}
        <div className="flex flex-col md:flex-row items-center text-center md:text-left justify-between gap-2 px-6 md:px-10 py-5 font-ki border-t text-xs md:text-sm text-background/40 border-x border-gray">
          <span>
            © {new Date().getFullYear()}{" "}
            <span className="text-[#ff6b00]">Kite AI</span>. All Rights Reserved.
          </span>
          <span>
            Designed &amp; Developed by{" "}
            <span className="text-[#ff6b00]">TIC Global Services</span>
          </span>
        </div>

      </ContainerLayout>
    </footer>
  );
};

export default Footer;
