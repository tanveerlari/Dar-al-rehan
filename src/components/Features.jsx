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
      className={`flex w-56 flex-shrink-0 flex-col items-center px-4 text-center md:w-auto md:flex-shrink ${
        borderRight ? "md:border-r md:border-neutral-200" : ""
      }`}
    >
      <Icon className="mb-2 h-6 w-6 text-amber-700" />
      <h3 className="text-sm font-semibold tracking-wide text-neutral-800">{feature.title}</h3>
      <p className="mt-1 text-xs text-neutral-500">{feature.description}</p>
    </div>
  );
}

export function Features() {
  return (
    <div className="w-full border-t border-neutral-200">
      <div className="mx-auto max-w-[1440px] py-8">
        {/* Mobile: infinite loop */}
        <div className="overflow-hidden md:hidden">
          <div className="flex w-max animate-[marquee_18s_linear_infinite] gap-6 pl-6">
            {[...features, ...features].map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>

        {/* Desktop: normal static grid */}
        <div className="hidden px-14 md:grid md:grid-cols-4 md:gap-6">
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