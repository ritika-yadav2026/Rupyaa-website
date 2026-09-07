import { IMAGES } from "@/lib/images";
import Image from "next/image";

export default function ZapcashLogo({
  width = 56,
  height = 56,
  className = "",
}: {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
  src?: string;
  title?: string;
  onError?: (error: Error) => void;
  onLoad?: () => void;
  onLoadEnd?: () => void;
  onLoadStart?: () => void;
}) {
  return (
    <>
      {/* <div className=" flex items-center justify-center">
      <div className="relative flex items-center justify-center"> */}
      <Image
        src={IMAGES.zapcashLogo.src}
        alt="ZapCash Logo"
        className={`h-${height} w-${width} rounded-full ${className}`}
        width={width}
        height={height}
      />
      {/* </div>
    </div> */}
    </>
  );
}