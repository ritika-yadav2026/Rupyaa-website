"use client";

import { useCallback, useRef, useState, type RefObject } from "react";

type UseSnapCarouselResult = {
  readonly activeIndex: number;
  readonly scrollRef: RefObject<HTMLDivElement | null>;
  readonly scrollToIndex: (index: number) => void;
  readonly handlePrev: () => void;
  readonly handleNext: () => void;
  readonly handleScroll: () => void;
  readonly isFirst: boolean;
  readonly isLast: boolean;
};

/**
 * Horizontal snap carousel that scrolls only its track (never the page).
 */
export function useSnapCarousel(itemCount: number): UseSnapCarouselResult {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollToIndex = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(index, itemCount - 1));
      setActiveIndex(clampedIndex);
      const container = scrollRef.current;
      if (!container) {
        return;
      }
      const el = container.children[clampedIndex] as HTMLElement | undefined;
      if (!el) {
        return;
      }
      const left = el.offsetLeft - (container.clientWidth - el.offsetWidth) / 2;
      container.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    },
    [itemCount],
  );
  const handlePrev = useCallback(() => {
    scrollToIndex(activeIndex - 1);
  }, [activeIndex, scrollToIndex]);
  const handleNext = useCallback(() => {
    scrollToIndex(activeIndex + 1);
  }, [activeIndex, scrollToIndex]);
  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || container.children.length === 0) {
      return;
    }
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < container.children.length; i += 1) {
      const child = container.children[i] as HTMLElement;
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }
    setActiveIndex(nearestIndex);
  }, []);
  return {
    activeIndex,
    scrollRef,
    scrollToIndex,
    handlePrev,
    handleNext,
    handleScroll,
    isFirst: activeIndex === 0,
    isLast: activeIndex >= itemCount - 1,
  };
}
