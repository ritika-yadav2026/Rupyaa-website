import type { CSSProperties, ReactElement } from "react";

const skylineStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  bottom: 0,
  width: "100%",
  height: "auto",
  objectFit: "contain",
  objectPosition: "bottom center",
  background: "transparent",
  zIndex: 0,
  pointerEvents: "none",
};

/**
 * Transparent skyline over the Personal Loan page gradient — bottom-pinned, natural aspect ratio.
 * Shared by the home hero and site footer.
 */
export default function HeroSkyline(): ReactElement {
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
