import type { CSSProperties, ReactElement } from "react";

/**
 * Transparent skyline over the Personal Loan page gradient — bottom-pinned.
 * Shared by the home hero and site footer. Uses assets from `/public/images`.
 */
export default function HeroSkyline(): ReactElement {
  const skylineStyle: CSSProperties = {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    height: "auto",
    maxHeight: "62vh",
    objectFit: "contain",
    objectPosition: "bottom center",
    background: "transparent",
    zIndex: 0,
    pointerEvents: "none",
  };

  return (
    <>
      <img
        src="/images/hero-skyline-mobile.png"
        alt=""
        width={770}
        height={1024}
        className="block sm:hidden"
        style={skylineStyle}
        aria-hidden
      />
      <img
        src="/images/hero-skyline-desktop.png"
        alt=""
        width={1024}
        height={445}
        className="hidden sm:block"
        style={skylineStyle}
        aria-hidden
      />
    </>
  );
}
