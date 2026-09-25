import { Link } from "react-router-dom";
import {
  ChevronRight,
  Sparkles,
  Heart,
  Droplets,
  Leaf,
  Flower2,
  ShieldCheck,
  Truck,
  BadgeCheck,
} from "lucide-react";
import { floraBelleProducts } from "../data";
import { ProductCard } from "../components/ProductCard";
import floraBelleBanner from "../assets/flora-belle-bannar.png";

const NOTES = [
  { icon: Flower2, label: "Top Notes", value: "Rose Petal · Bergamot · Peony" },
  { icon: Leaf, label: "Heart Notes", value: "Jasmine · Iris · Freesia" },
  { icon: Droplets, label: "Base Notes", value: "Musk · Amber · Sandalwood" },
];

const PROMISES = [
  { icon: BadgeCheck, title: "Long Lasting", desc: "12+ hours of elegant sillage" },
  { icon: ShieldCheck, title: "Skin Safe", desc: "Dermatologically tested blend" },
  { icon: Truck, title: "Free Delivery", desc: "On all prepaid orders" },
];

export function FloraBellePage() {
  return (
    <div className="w-full bg-[#FDFBF7]">
      {/* ================= HERO (IVORY + GOLD) ================= */}
      <section className="w-full px-3 pt-3 sm:px-5 md:px-8">
        <div className="relative w-full overflow-hidden rounded-2xl border border-amber-700/15 bg-gradient-to-br from-[#FFFDF8] via-[#FAF3E7] to-[#F0E3CC] shadow-[0_30px_70px_-35px_rgba(146,104,42,0.45)] md:rounded-[28px]">
          {/* warm ambient glow — pointer-events-none so it never steals hover */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-[22rem] w-[22rem] rounded-full bg-amber-300/40 blur-[90px]" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-[20rem] w-[20rem] rounded-full bg-[#E9C98A]/40 blur-[90px]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.6)_25%,transparent_70%)]" />
          {/* soft grain */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
          {/* inner gold frame */}
          <div className="pointer-events-none absolute inset-3 rounded-xl border border-amber-700/10 md:inset-5 md:rounded-2xl" />

          {/* vertical side label */}
          <span className="pointer-events-none absolute left-5 top-1/2 hidden -translate-y-1/2 rotate-180 text-[10px] tracking-[0.5em] text-amber-800/35 [writing-mode:vertical-rl] lg:block">
            EAU DE PARFUM · 2026
          </span>

          <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col items-center gap-10 px-6 py-14 sm:py-20 md:flex-row md:justify-between md:px-16 lg:px-24">
            {/* ---------- copy ---------- */}
            <div className="relative z-20 max-w-xl text-center md:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-700/20 bg-white/70 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-amber-800 shadow-sm backdrop-blur">
                <Sparkles className="h-3 w-3 text-amber-600" />
                For Women's Only/-
              </span>

              <h1 className="mt-6 font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block bg-gradient-to-b from-[#C9A24B] via-[#A97C2E] to-[#6B4A18] bg-clip-text text-transparent">
                  FLORA
                </span>
                <span className="block bg-gradient-to-b from-[#C9A24B] via-[#A97C2E] to-[#6B4A18] bg-clip-text text-transparent">
                  BELLE
                </span>
              </h1>

              <div className="mx-auto mt-6 flex max-w-xs items-center gap-3 md:mx-0">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-700/35 to-amber-700/35 md:from-amber-700/35 md:to-transparent" />
                <span className="text-[10px] tracking-[0.35em] text-amber-800/60">
                  TWO SHADES
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-700/35 to-amber-700/35 md:hidden" />
              </div>

              <p className="mt-6 text-sm leading-relaxed text-neutral-600 sm:text-base">
                One essence, two moods. A quiet luxury built on rose, jasmine and
                warm amber — crafted to linger long after you leave the room.
              </p>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row md:items-start">
                <a
                  href="#shades"
                  className="group/cta inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D8B463] via-[#C29A45] to-[#A97C2E] px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_14px_30px_-12px_rgba(169,124,46,0.75)] transition-all hover:brightness-110 hover:shadow-[0_18px_38px_-12px_rgba(169,124,46,0.85)]"
                >
                  Explore Shades
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-0.5" />
                </a>
                <span className="text-[11px] uppercase tracking-[0.2em] text-amber-800/60">
                  Limited Edition
                </span>
              </div>
            </div>

{/* ---------- bottle ---------- */}
<div className="relative z-10 flex items-center justify-center">
  <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-amber-200/60 blur-[70px]" />
  <div className="pointer-events-none absolute h-[19rem] w-[19rem] rounded-full border border-amber-700/15" />
  <div className="pointer-events-none absolute h-[15rem] w-[15rem] rounded-full border border-amber-700/10" />
  <div className="group/bottle relative flex items-center justify-center overflow-visible rounded-[26px] border border-white bg-white/75 p-7 pb-10 shadow-[0_25px_55px_-22px_rgba(146,104,42,0.45)] backdrop-blur-xl transition-transform duration-700 hover:-translate-y-1.5 hover:scale-[1.03]">
    {/* diagonal shine — image ke NEECHE (z-0), sirf sweep karti hai */}
    <span className="pointer-events-none absolute -inset-y-10 -left-1/3 z-0 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-0 transition-all duration-[900ms] ease-out group-hover/bottle:left-[110%] group-hover/bottle:opacity-100" />
    <img
      src={floraBelleBanner}
      alt="Flora Belle perfume bottles"
      fetchPriority="high"
      loading="eager"
      className="relative z-10 h-48 w-auto object-contain drop-shadow-[0_18px_28px_rgba(120,53,15,0.28)] transition-transform duration-700 sm:h-60 md:h-72"
    />
    <span className="absolute -bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-amber-700/20 bg-white/95 px-4 py-1.5 text-[9px] tracking-[0.3em] text-amber-800 shadow-sm backdrop-blur whitespace-nowrap">
      SIGNATURE SCENT
    </span>
  </div>
          </div>
        </div>
        </div>
      </section>


      {/* ================= BREADCRUMB ================= */}
      <div className="mx-auto flex max-w-[1440px] items-center gap-1.5 px-6 py-5 text-[11px] uppercase tracking-[0.15em] text-neutral-500 md:px-14">
        <Link to="/" className="transition-colors hover:text-amber-700">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-neutral-800">Flora Belle</span>
      </div>

      {/* ================= FRAGRANCE NOTES ================= */}
      <section className="mx-auto max-w-[1440px] px-6 pb-4 md:px-14">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-amber-700/15 bg-amber-700/10 sm:grid-cols-3">
          {NOTES.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-[#FFFDF8] px-6 py-7 text-center transition-colors hover:bg-white"
            >
              <Icon className="mx-auto h-4 w-4 text-amber-600" />
              <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.3em] text-amber-800/70">
                {label}
              </p>
              <p className="mt-2 font-serif text-base text-neutral-800">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TWO PRODUCT SHOWCASE ================= */}
      <section id="shades" className="mx-auto max-w-[1440px] px-6 py-14 md:px-14">
        <div className="mb-12 text-center">
          <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-amber-700">
            The Collection
          </span>
          <h2 className="mt-3 font-serif text-3xl text-neutral-900 sm:text-4xl">
            Choose Your Shade
          </h2>
          <p className="mx-auto mt-3 inline-flex max-w-md items-center justify-center gap-1.5 text-sm text-neutral-500">
            <Heart className="h-3.5 w-3.5 text-amber-600" />
            Two distinct personalities, one signature essence.
          </p>
          <div className="mx-auto mt-6 flex w-40 items-center gap-2">
            <span className="h-px flex-1 bg-amber-700/20" />
            <span className="h-1.5 w-1.5 rotate-45 bg-amber-600/70" />
            <span className="h-px flex-1 bg-amber-700/20" />
          </div>
        </div>

        <div className="relative mx-auto grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8">
          <span className="pointer-events-none absolute bottom-6 left-1/2 top-6 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-amber-700/20 to-transparent sm:block" />

          {floraBelleProducts.map((product, i) => (
            <div key={product.id} className="group/card relative mx-auto w-full max-w-sm">
              <span className="pointer-events-none absolute -top-3 left-1/2 z-20 -translate-x-1/2 rounded-full border border-amber-700/20 bg-[#FDFBF7] px-3 py-0.5 font-serif text-[11px] tracking-[0.2em] text-amber-800 shadow-sm">
                0{i + 1}
              </span>

              <div className="relative overflow-hidden rounded-[22px] border border-amber-700/15 bg-gradient-to-br from-white to-[#FBF5EA] p-3 shadow-[0_18px_40px_-24px_rgba(146,104,42,0.4)] transition-all duration-500 group-hover/card:-translate-y-1.5 group-hover/card:border-amber-600/40 group-hover/card:shadow-[0_28px_55px_-24px_rgba(146,104,42,0.5)]">
                <div className="pointer-events-none absolute -right-10 -top-10 z-0 h-32 w-32 rounded-full bg-amber-200/60 opacity-0 blur-2xl transition-opacity duration-500 group-hover/card:opacity-100" />
                <div className="relative z-10 rounded-[16px] bg-white">
                  <ProductCard product={product} />
                </div>
              </div>

              <span className="pointer-events-none absolute left-2 top-2 h-5 w-5 rounded-tl-[14px] border-l border-t border-amber-600/50 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />
              <span className="pointer-events-none absolute bottom-2 right-2 h-5 w-5 rounded-br-[14px] border-b border-r border-amber-600/50 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100" />
            </div>
          ))}
        </div>
      </section>

      {/* ================= PROMISE STRIP ================= */}
      <section className="mx-auto max-w-[1440px] px-6 pb-16 md:px-14">
        <div className="grid grid-cols-1 gap-6 rounded-2xl border border-amber-700/15 bg-gradient-to-br from-[#FFFDF8] to-[#F3E8D4] p-8 shadow-[0_18px_40px_-30px_rgba(146,104,42,0.4)] sm:grid-cols-3">
          {PROMISES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-700/20 bg-white shadow-sm">
                <Icon className="h-4 w-4 text-amber-600" />
              </span>
              <div>
                <p className="font-serif text-base text-neutral-900">{title}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CLOSING CTA (PEARL + GOLD) ================= */}
      <section className="w-full px-3 pb-10 sm:px-5 md:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-amber-700/15 bg-gradient-to-b from-white via-[#FBF4E8] to-[#F1E4CE] px-8 py-14 text-center shadow-[0_25px_60px_-35px_rgba(146,104,42,0.45)] md:rounded-[28px] md:py-16">
          <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/45 blur-[80px]" />
          <div className="pointer-events-none absolute inset-4 rounded-xl border border-amber-700/10 md:rounded-2xl" />
          <p className="relative text-[10px] uppercase tracking-[0.4em] text-amber-700">
            Flora Belle
          </p>
          <h3 className="relative mt-4 font-serif text-2xl text-neutral-900 sm:text-3xl">
            Elegance in every drop.
          </h3>
          <Link
            to="/"
            className="relative mt-8 inline-flex items-center gap-2 rounded-full border border-amber-700/30 bg-white/70 px-7 py-3 text-xs uppercase tracking-[0.2em] text-amber-800 shadow-sm backdrop-blur transition-colors hover:bg-white"
          >
            Browse Full Store
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}