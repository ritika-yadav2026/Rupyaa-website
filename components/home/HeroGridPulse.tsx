"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Square = {
  col: number;
  row: number;
  delay: string;
  duration: string;
};

function buildSquares(cols: number, rows: number, density: number): Square[] {
  if (cols <= 0 || rows <= 0) return [];
  const target = Math.max(1, Math.round(cols * rows * density));
  const taken = new Set<string>();
  const squares: Square[] = [];
  let safety = target * 10;
  while (squares.length < target && safety-- > 0) {
    const col = Math.floor(Math.random() * cols);
    const row = Math.floor(Math.random() * rows);
    const key = `${col}:${row}`;
    if (taken.has(key)) continue;
    taken.add(key);
    const delay = (Math.random() * 3).toFixed(2) + "s";
    const duration = (3 + Math.random() * 1.4).toFixed(2) + "s";
    squares.push({ col, row, delay, duration });
  }
  return squares;
}

export default function HeroGridPulse({
  cellSize = 40,
  density = 0.04,
}: {
  cellSize?: number;
  density?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [dims, setDims] = useState({ cols: 0, rows: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      setDims({
        cols: Math.ceil(width / cellSize),
        rows: Math.ceil(height / cellSize),
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cellSize]);

  const squares = useMemo(
    () => buildSquares(dims.cols, dims.rows, density),
    [dims.cols, dims.rows, density]
  );

  return (
    <>
      <style>{`
        @keyframes heroGridPulse {
          0%, 100% { transform: scale(0.55); opacity: 0; }
          45%, 55% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div
        ref={ref}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {squares.map((s, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: s.col * cellSize,
              top: s.row * cellSize,
              width: cellSize,
              height: cellSize,
              background: "rgba(0, 101, 37, 0.18)",
              border: "1px solid rgba(0, 101, 37, 0.28)",
              transformOrigin: "center",
              animation: `heroGridPulse ${s.duration} ease-in-out ${s.delay} infinite`,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>
    </>
  );
}
