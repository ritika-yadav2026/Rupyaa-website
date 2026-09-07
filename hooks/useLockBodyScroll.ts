import { useEffect } from "react";

let lockCount = 0;
let savedOverflow = "";
let savedPaddingRight = "";

/**
 * Prevents the page behind a modal from scrolling while `locked` is true.
 * Uses a ref-count so nested/stacked modals restore scroll only when all are closed.
 */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    lockCount += 1;
    if (lockCount === 1) {
      savedOverflow = document.body.style.overflow;
      savedPaddingRight = document.body.style.paddingRight;

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.overflow = savedOverflow;
        document.body.style.paddingRight = savedPaddingRight;
      }
    };
  }, [locked]);
}
