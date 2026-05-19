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
    <footer className="bg-primary text-background w-full">
      <ContainerLayout disablePaddingY className="">

        {/* ── Main grid: 1 col mobile → 3 col desktop ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:min-h-[60dvh] border-t border-x border-gray pt-14">

          {/* ── Col 1: wave (top) + policies (bottom) ── */}
          <div className="flex flex-col md:border-r border-b md:border-b-0 md:border-t border-gray">

            {/* GIF — always visible */}
            <div className="relative overflow-hidden border-b border-gray min-h-[200px] h-70 md:h-auto md:flex-1">
              <Image src="/assets/gif/loop3.gif" alt="Kite" fill className="object-cover" unoptimized />
            </div>

            {/* Policies */}
            <div className="p-8 md:p-10 space-y-4">
              <p className="text-[#ff6b00] text-xl">Policies</p>
              <ul className="space-y-2">
                {legal.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-background/70 hover:text-background text-lg font-ki transition-colors duration-200"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Col 2: large Kite logo ── */}
          <div className="relative md:border-r border-b md:border-b-0 md:border-t border-gray overflow-hidden min-h-[200px] md:min-h-0">
            <Image
              src="/logo_white.svg"
              alt="Kite"
              fill
              className="object-contain p-10"
            />
          </div>

          {/* ── Col 3: connect (top) + wave bottom (desktop only) ── */}
          <div className="flex flex-col md:border-t border-gray">

            {/* Connect + social icons */}
            <div className="p-8 md:p-10 space-y-3 border-b border-gray">
              <p className="text-[#ff6b00] text-xl">Connect</p>
              <p className="text-background/60 font-ki text-base">
                Day or night, we love <br className="hidden md:block" />to hear you talk!
              </p>
              <div className="flex items-center gap-3">
                {social.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="w-10 h-10 rounded-full border border-gray flex items-center justify-center bg-background text-foreground transition-all duration-200"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* GIF — desktop only */}
            <div className="hidden md:block flex-1 relative overflow-hidden">
              <Image src="/assets/gif/loop3.gif" alt="Kite" fill className="object-cover" unoptimized />
            </div>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 px-8 md:px-10 py-5 font-ki border-t text-sm md:text-base text-background/40 border-x border-gray">
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
