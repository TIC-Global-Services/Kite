"use client";

import React from "react";
import Link from "next/link";
import WaveIcon from "./WaveIcon";

interface BaseProps {
  children: React.ReactNode;
  isPlaying?: boolean;
  showIcon?: boolean;
  className?: string;
}

type KiteButtonProps =
  | (BaseProps &
      React.ButtonHTMLAttributes<HTMLButtonElement> & {
        href?: never;
      })
  | (BaseProps &
      React.AnchorHTMLAttributes<HTMLAnchorElement> & {
        href: string;
      });

const PrimaryButton = (props: KiteButtonProps) => {
  const {
    children,
    isPlaying = true,
    showIcon = true,
    className = "",
    ...rest
  } = props;

const baseStyles = `
  font-ki
  inline-flex
  items-center
  justify-center
  gap-4
  bg-primary
  text-background
  px-6
  py-2
  font-bold
  text-lg
  cursor-pointer
  transition-all
  duration-300
  hover:scale-[1.02]
  [clip-path:polygon(8%_0%,100%_0%,100%_78%,92%_100%,0%_100%,0%_22%)]
  ${className}
`;
  const buttonContent = (
    <>
      <span>{children}</span>
      {showIcon && <WaveIcon isPlaying={isPlaying} />}
    </>
  );

  // Link
  if ("href" in rest && rest.href) {
    const { href, ...linkProps } = rest;

    return (
      <Link
        href={href}
        className={baseStyles}
        {...(linkProps as any)}
      >
        {buttonContent}
      </Link>
    );
  }

  // Button
  const {
    onClick,
    type = "button",
    disabled,
    ...buttonProps
  } = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
      {...buttonProps}
    >
      {buttonContent}
    </button>
  );
};

export default PrimaryButton;