import { Sparkles, Clock, Gift, ShieldCheck } from "lucide-react";
import { features } from "../data";

const iconMap = {
  sparkles: Sparkles,
  clock: Clock,
  gift: Gift,
  shield: ShieldCheck,
};

function FeatureCard({ feature, borderRight }) {
  const Icon = iconMap[feature.icon];
  return (
    <div
      className={`flex w-56 flex-shrink-0 flex-col items-center px-5 text-center md:w-auto md:flex-shrink ${
        borderRight ? "md:border-r md:border-amber-300/50" : ""
      }`}
    >
      {/* ── Ornamental Icon Badge ── */}
      <div className="relative mb-3.5 mt-1.5">
        {/* Outer decorative ring */}
        <div className="absolute -inset-1.5 rounded-full border border-amber-400/30" />
        {/* Inner golden medallion */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-[1.5px] border-amber-500/50 bg-gradient-to-b from-amber-50 via-white to-amber-50 shadow-[0_2px_12px_-2px_rgba(194,155,48,0.25)]">
          {/* Corner dots */}
          <span className="absolute -top-[3px] left-1/2 -translate-x-1/2 h-[5px] w-[5px] rounded-full bg-amber-400/60" />
          <span className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 h-[5px] w-[5px] rounded-full bg-amber-400/60" />
          <span className="absolute top-1/2 -left-[3px] -translate-y-1/2 h-[5px] w-[5px] rounded-full bg-amber-400/60" />
          <span className="absolute top-1/2 -right-[3px] -translate-y-1/2 h-[5px] w-[5px] rounded-full bg-amber-400/60" />
          {/* Icon */}
          <Icon className="h-6 w-6 text-amber-700" strokeWidth={1.5} />
        </div>
      </div>

      {/* ── Title ── */}
      <h3
        className="text-[12px] font-bold tracking-[0.15em] text-neutral-800"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {feature.title}
      </h3>

      {/* ── Tiny separator ── */}
      <div className="my-1.5 flex items-center gap-1">
        <span className="h-px w-3 bg-amber-400/50" />
        <span className="text-[5px] text-amber-400">◆</span>
        <span className="h-px w-3 bg-amber-400/50" />
      </div>

      {/* ── Description ── */}
      <p className="text-[11.5px] leading-relaxed text-neutral-500">
        {feature.description}
      </p>
    </div>
  );
}

export function Features() {
  return (
    <div className="w-full border-t border-amber-200/60 bg-gradient-to-b from-amber-50/40 via-white to-white pb-6 md:pb-0">
      <div className="mx-auto max-w-[1440px] py-9">
        {/* Mobile: infinite loop */}
        <div className="overflow-hidden py-1.5 md:hidden">
          <div className="flex w-max animate-[marquee_18s_linear_infinite] gap-6 pl-6 pr-6">
            {[...features, ...features].map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>

        {/* Desktop: static grid */}
        <div className="hidden px-14 md:grid md:grid-cols-4 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              borderRight={index !== features.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}