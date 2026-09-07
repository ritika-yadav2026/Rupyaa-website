import { IMAGES } from "@/lib/images";

export default function ZapcashLoading() {
  return (
    <div className=" flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div
          className="absolute h-12 w-12 mb-4 animate-spin rounded-full border-[3px] border-transparent border-t-primary border-r-primary"
        />
        <img
          src={IMAGES.icon.src}
          alt="ZapCash Icon"
          className="h-8 w-8 rounded-full mb-4"
        />
      </div>
    </div>
  );
}