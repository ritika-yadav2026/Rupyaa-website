import type { ReactElement, ReactNode } from "react";

type HeroSkylineProps = {
  readonly className?: string;
};

const STROKE = "#C9920F";
const STROKE_WIDTH = 2.25;
const GROUND_Y = 280;

type BuildingProps = {
  readonly x: number;
  readonly width: number;
  readonly height: number;
  readonly windows?: ReadonlyArray<readonly [number, number]>;
  readonly antenna?: number;
  readonly step?: readonly [number, number];
};

/**
 * Draws one outlined building block with optional windows and antenna.
 */
function Building({
  x,
  width,
  height,
  windows = [],
  antenna,
  step,
}: BuildingProps): ReactElement {
  const top = GROUND_Y - height;
  let roofPath: string;
  if (step) {
    const [stepWidth, stepHeight] = step;
    roofPath = `M${x} ${GROUND_Y} V${top + stepHeight} H${x + stepWidth} V${top} H${x + width} V${GROUND_Y}`;
  } else {
    roofPath = `M${x} ${GROUND_Y} V${top} H${x + width} V${GROUND_Y}`;
  }
  let antennaLine: ReactNode = null;
  if (antenna != null) {
    antennaLine = (
      <line
        x1={x + antenna}
        y1={top}
        x2={x + antenna}
        y2={top - 18}
        stroke={STROKE}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
      />
    );
  }
  return (
    <g>
      <path d={roofPath} fill="none" stroke={STROKE} strokeWidth={STROKE_WIDTH} strokeLinejoin="round" />
      {windows.map(([wx, wy]) => (
        <rect
          key={`${x}-${wx}-${wy}`}
          x={x + wx}
          y={top + wy}
          width={6}
          height={6}
          fill="none"
          stroke={STROKE}
          strokeWidth={1.5}
        />
      ))}
      {antennaLine}
    </g>
  );
}

/**
 * Custom yellow line-art city skyline for the home hero (bottom lining).
 */
export default function HeroSkyline({ className = "" }: HeroSkylineProps): ReactElement {
  return (
    <svg
      className={`h-auto w-full ${className}`}
      viewBox="0 0 1440 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      preserveAspectRatio="xMidYMax meet"
    >
      <Building x={8} width={70} height={110} windows={[[18, 28], [42, 28], [18, 52], [42, 52], [18, 76], [42, 76]]} />
      <Building x={78} width={52} height={78} windows={[[14, 22], [32, 22], [14, 44], [32, 44]]} />
      <Building x={130} width={88} height={168} antenna={44} windows={[[20, 30], [44, 30], [68, 30], [20, 56], [44, 56], [68, 56], [20, 82], [44, 82], [68, 82], [20, 108], [44, 108], [68, 108]]} />
      <Building x={218} width={60} height={95} windows={[[14, 24], [36, 24], [14, 48], [36, 48], [14, 72], [36, 72]]} />
      <Building x={278} width={100} height={140} step={[28, 28]} windows={[[40, 40], [64, 40], [40, 66], [64, 66], [40, 92], [64, 92]]} />
      <Building x={378} width={48} height={72} windows={[[12, 20], [28, 20], [12, 42], [28, 42]]} />
      <Building x={426} width={76} height={190} antenna={38} windows={[[16, 28], [40, 28], [16, 54], [40, 54], [16, 80], [40, 80], [16, 106], [40, 106], [16, 132], [40, 132], [16, 158], [40, 158]]} />
      <Building x={502} width={64} height={118} windows={[[14, 26], [36, 26], [14, 50], [36, 50], [14, 74], [36, 74]]} />
      <Building x={566} width={92} height={155} windows={[[18, 28], [42, 28], [66, 28], [18, 54], [42, 54], [66, 54], [18, 80], [42, 80], [66, 80], [18, 106], [42, 106], [66, 106]]} />
      <Building x={658} width={56} height={88} windows={[[14, 22], [34, 22], [14, 46], [34, 46]]} />
      <Building x={714} width={110} height={175} step={[32, 32]} antenna={70} windows={[[44, 44], [68, 44], [44, 70], [68, 70], [44, 96], [68, 96], [44, 122], [68, 122]]} />
      <Building x={824} width={58} height={102} windows={[[14, 24], [34, 24], [14, 48], [34, 48], [14, 72], [34, 72]]} />
      <Building x={882} width={84} height={148} windows={[[18, 28], [42, 28], [66, 28], [18, 54], [42, 54], [66, 54], [18, 80], [42, 80], [66, 80]]} />
      <Building x={966} width={50} height={80} windows={[[12, 22], [30, 22], [12, 44], [30, 44]]} />
      <Building x={1016} width={96} height={165} antenna={48} windows={[[20, 30], [44, 30], [68, 30], [20, 56], [44, 56], [68, 56], [20, 82], [44, 82], [68, 82], [20, 108], [44, 108], [68, 108]]} />
      <Building x={1112} width={68} height={112} windows={[[16, 26], [40, 26], [16, 50], [40, 50], [16, 74], [40, 74]]} />
      <Building x={1180} width={78} height={138} step={[22, 24]} windows={[[30, 36], [52, 36], [30, 62], [52, 62], [30, 88], [52, 88]]} />
      <Building x={1258} width={54} height={90} windows={[[14, 22], [32, 22], [14, 46], [32, 46]]} />
      <Building x={1312} width={88} height={160} antenna={44} windows={[[18, 28], [42, 28], [66, 28], [18, 54], [42, 54], [66, 54], [18, 80], [42, 80], [66, 80], [18, 106], [42, 106], [66, 106]]} />
      <Building x={1400} width={40} height={70} windows={[[10, 20], [24, 20], [10, 42], [24, 42]]} />
      <line x1="0" y1={GROUND_Y} x2="1440" y2={GROUND_Y} stroke={STROKE} strokeWidth={STROKE_WIDTH} />
    </svg>
  );
}
