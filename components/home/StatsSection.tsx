import { appShellContainerClassName } from "@/lib/app-shell-layout";

const STATS = [
  { value: "24×7", label: "LOAN ACCESS" },
  { value: "100k+", label: "DOWNLOADS" },
  { value: "15,000+", label: "PINCODE SERVED" },
  { value: "4.2/5", label: "PLAY STORE RATING" },
] as const;

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-[#f3f7f5] py-7 sm:py-9 lg:py-12">
      <div className={`relative z-10 !p-0 ${appShellContainerClassName}`}>
        <div className="grid grid-cols-2 gap-y-8 md:grid-cols-4 md:gap-y-0 md:[&>*+*]:border-l md:[&>*+*]:border-[#dfe7e3]">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex min-h-[78px] min-w-0 flex-col items-center justify-center px-3 text-center sm:min-h-[88px] md:min-h-[96px] md:px-5 lg:px-8"
            >
              <span className="text-2xl font-extrabold leading-none text-[#006525] sm:text-3xl md:text-4xl lg:text-[40px]">
                {stat.value}
              </span>
              <span className="mt-3 text-[11px] font-bold uppercase leading-tight tracking-normal text-[#6b778d] sm:text-xs md:whitespace-nowrap md:text-sm lg:text-base xl:text-lg">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
