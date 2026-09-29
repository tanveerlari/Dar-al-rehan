import { Link } from "react-router-dom";
import { 
  Phone, 
  Mail, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Crown
} from "lucide-react";

export function AboutPage() {
  return (
    <div className="w-full">
      {/* 1. Animated Hero Banner - Consistent Screen Gap & Luxury Card */}
      <div className="w-full px-3 sm:px-5 md:px-8 pt-3 pb-2 overflow-hidden">
        <div className="relative w-full overflow-hidden rounded-xl md:rounded-2xl border border-amber-900/10 bg-gradient-to-br from-[#FAF6F0] via-[#F4EDE2] to-[#E9DEC9] shadow-md animate-hero-reveal">
          
          {/* Ambient Royal Gold Aura */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl" />
          <div className="pointer-events-none absolute right-10 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-amber-400/20 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-[1440px] px-6 py-12 text-center md:px-14 sm:py-16">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-900/10 px-4 py-1 text-[11px] font-medium tracking-[0.25em] text-amber-800 border border-amber-900/15 mb-3 uppercase">
              <Sparkles className="h-3 w-3 text-amber-700" />
              Heritage & Craftsmanship
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-neutral-900">
              ABOUT DAR AL REHAN
            </h1>

            <div className="mx-auto my-4 h-0.5 w-12 bg-amber-700/60" />

            <p className="mx-auto max-w-xl text-sm sm:text-base text-neutral-600 leading-relaxed font-light">
              Scents that speak memories. Rooted in royal perfumery traditions, formulated with pure botanical extracts, and designed for timeless elegance.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Breadcrumb */}
      <div className="mx-auto flex max-w-[1440px] items-center gap-1 px-6 py-4 text-xs text-neutral-500 md:px-14">
        <Link to="/" className="hover:text-amber-700">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-neutral-800">About Us</span>
      </div>

      {/* 3. Luxury Brand Pillars (3 Value Cards) */}
      <div className="mx-auto max-w-[1440px] px-6 py-6 md:px-14">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
          {/* Pillar 1 */}
          <div className="rounded-2xl border border-amber-950/10 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-800">
              <Crown className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg text-neutral-800">Royal Heritage</h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500">
              Inspired by royal oriental perfumery traditions, each fragrance is compounded with meticulous artisanal attention.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-2xl border border-amber-950/10 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-800">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg text-neutral-800">100% Pure Extracts</h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500">
              Ethically harvested botanicals and natural distillates. Our attars are completely alcohol-free and skin-friendly.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-2xl border border-amber-950/10 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-800">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg text-neutral-800">Long-Lasting Sillage</h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500">
              Formulated with high oil concentration for enduring longevity and a memorable, lingering scent trail.
            </p>
          </div>

        </div>
      </div>

      {/* 4. Our Story Section */}
      <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-14">
        <div className="relative overflow-hidden rounded-2xl border border-amber-950/10 bg-amber-50/30 p-8 sm:p-12 md:p-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold tracking-widest text-amber-800 uppercase">
              The Essence of Dar Al Rehan
            </span>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl text-neutral-800">
              Where Ancient Craft Meets Modern Luxury
            </h2>
            <div className="mx-auto my-4 h-0.5 w-10 bg-amber-700"></div>

            <p className="text-sm sm:text-base leading-relaxed text-neutral-600">
              Dar Al Rehan was born from a deep reverence for authentic oriental perfumery and the timeless craft of attar distillation. We believe that fragrance is not merely an accessory—it is an invisible signature, a quiet language of grace, memories, and personal legacy.
            </p>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-600">
              Every drop is distilled from the finest blossoms, woods, and precious resins, bridging centuries of artisanal mastery with contemporary aesthetic sophistication.
            </p>

            {/* Micro Stats */}
            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-amber-900/10 pt-8 sm:grid-cols-4">
              <div>
                <p className="font-serif text-2xl font-bold text-amber-800">100%</p>
                <p className="text-[11px] text-neutral-500 tracking-wide">Pure Attar Blends</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-amber-800">8 to 12h</p>
                <p className="text-[11px] text-neutral-500 tracking-wide">Scent Longevity</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-amber-800">0%</p>
                <p className="text-[11px] text-neutral-500 tracking-wide">Alcohol in Attar</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-amber-800">Handcrafted</p>
                <p className="text-[11px] text-neutral-500 tracking-wide">Small Batches</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Contact Us Section (Interactive & Clickable Cards) */}
      <div className="w-full border-t border-neutral-200 bg-white py-14">
        <div className="mx-auto max-w-[1440px] px-6 text-center md:px-14">
          <span className="text-xs font-semibold tracking-widest text-amber-800 uppercase">
            Get In Touch
          </span>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl text-neutral-800">
            We Would Love to Hear From You
          </h2>
          <div className="mx-auto my-3 h-0.5 w-10 bg-amber-700"></div>
          <p className="mx-auto mb-10 max-w-md text-sm text-neutral-500">
            Have an inquiry about custom orders, corporate gifting, or fragrance notes? Connect directly with us.
          </p>

          <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-5 sm:flex-row">
            
            {/* Phone Card (Clickable to Call) */}
            <a
              href="tel:+918668479343"
              className="group flex w-full sm:w-1/2 items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-amber-700/50 hover:bg-amber-50/40 hover:shadow-md"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-700/10 text-amber-700 transition-colors group-hover:bg-amber-700 group-hover:text-white">
                <Phone className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-neutral-400 font-medium">Call / WhatsApp</p>
                <p className="text-sm font-semibold text-neutral-800 group-hover:text-amber-800 transition-colors">
                  +91 86684 79343
                </p>
              </div>
            </a>

            {/* Email Card (Clickable to Email) */}
            <a
              href="mailto:daralrehan01@gmail.com"
              className="group flex w-full sm:w-1/2 items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-amber-700/50 hover:bg-amber-50/40 hover:shadow-md"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-700/10 text-amber-700 transition-colors group-hover:bg-amber-700 group-hover:text-white">
                <Mail className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-neutral-400 font-medium">Email Us</p>
                <p className="text-sm font-semibold text-neutral-800 group-hover:text-amber-800 transition-colors truncate">
                  daralrehan01@gmail.com
                </p>
              </div>
            </a>

          </div>
        </div>
      </div>
    </div>
  );
}