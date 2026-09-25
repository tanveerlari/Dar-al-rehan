import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

export function OpeningOfferBanner() {
  return (
    <section className="w-full px-3 sm:px-6 md:px-10 lg:px-14 py-3">
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-2xl border-[1.5px] border-amber-500/40 bg-gradient-to-br from-[#1c140a] via-[#2a1d0f] to-[#140d06] p-6 text-white shadow-2xl sm:p-8 md:p-10">
        {/* Luxury Background Glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-amber-600/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

        {/* ── Corner Ornaments ── */}
        <div className="pointer-events-none absolute top-3 left-3 h-5 w-5 border-t-2 border-l-2 border-amber-400/50" />
        <div className="pointer-events-none absolute top-3 right-3 h-5 w-5 border-t-2 border-r-2 border-amber-400/50" />
        <div className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-amber-400/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-amber-400/50" />

        <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-3.5 py-1 text-[11px] font-semibold tracking-[0.2em] text-amber-300 uppercase backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
              <span>Grand Opening Offer</span>
            </div>

            {/* Main Headline */}
            <h2 className="mt-3 font-serif text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 sm:text-4xl md:text-5xl">
              FLAT 20% OFF
            </h2>

            {/* Subtitle */}
            <p className="mt-2 text-sm text-amber-100/85 sm:text-base md:text-lg font-light leading-relaxed">
              Welcome to <span className="font-semibold text-amber-200">Dar Al Rehan</span>. Special inaugural discount across our entire luxury collection of pure attars & fine perfumes.
            </p>

            {/* Micro Highlights */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-amber-200/70 lg:justify-start">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Pure & Alcohol-Free Options
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Long Lasting Luxury Sillage
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Complimentary Gift Packaging
              </span>
            </div>
          </div>

          {/* Right Content: Clean Shop Now Button */}
          <div className="flex flex-shrink-0 items-center justify-center">
            <Link
              to="/shop"
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl border border-amber-300/80 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 px-8 py-4 text-xs sm:text-sm font-bold tracking-[0.18em] text-neutral-950 uppercase shadow-xl shadow-amber-950/40 transition-all duration-300 hover:scale-[1.04] hover:shadow-amber-500/40 active:scale-95"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
