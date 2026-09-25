import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { products } from "../data";

export function ProductsSection() {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState(null);

  const handleClick = (e, item) => {
    e.preventDefault();
    if (activeButton !== null) return;
    setActiveButton(item.id);
    setTimeout(() => {
      navigate(item.link);
    }, 350);
  };

  return (
    <div className="w-full">
      <div className="mx-auto flex max-w-[1440px] flex-col items-stretch gap-4 px-4 py-8 sm:px-6 md:flex-row md:gap-5 md:px-10 lg:px-14">
        {products.map((item) => {
          const isActive = activeButton === item.id;

          return (
            <div
              key={item.id}
              className="group/card relative flex min-w-0 flex-1 flex-col transition-all duration-500 hover:-translate-y-1.5"
            >
              {/* ══════ OUTER GOLDEN FRAME ══════ */}
              <div className="relative flex h-full flex-1 flex-col rounded-xl border-[2px] border-amber-600/50 bg-gradient-to-b from-amber-100/70 via-amber-50/30 to-amber-100/70 p-[9px] shadow-sm transition-shadow duration-500 group-hover/card:shadow-lg group-hover/card:shadow-amber-200/40">

                {/* ── Corner Ornaments (4 corners) ── */}
                {/* Top-Left */}
                <div className="absolute top-[3px] left-[3px] h-5 w-5 border-t-[2.5px] border-l-[2.5px] border-amber-500/60 rounded-tl-lg" />
                {/* Top-Right */}
                <div className="absolute top-[3px] right-[3px] h-5 w-5 border-t-[2.5px] border-r-[2.5px] border-amber-500/60 rounded-tr-lg" />
                {/* Bottom-Left */}
                <div className="absolute bottom-[3px] left-[3px] h-5 w-5 border-b-[2.5px] border-l-[2.5px] border-amber-500/60 rounded-bl-lg" />
                {/* Bottom-Right */}
                <div className="absolute bottom-[3px] right-[3px] h-5 w-5 border-b-[2.5px] border-r-[2.5px] border-amber-500/60 rounded-br-lg" />

                {/* ══════ INNER GOLDEN FRAME ══════ */}
                <div className="flex h-full min-w-0 flex-1 flex-col justify-between gap-5 rounded-lg border border-amber-500/30 bg-white/80 backdrop-blur-sm px-6 py-7 sm:px-7 sm:py-8">

                  {/* ── Top: Text + Image ── */}
                  <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 text-center sm:text-left">
                      <h2
                        className="text-[26px] tracking-[0.12em] text-neutral-800 sm:text-3xl"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        {item.title}
                      </h2>

                      {/* Gold line separator */}
                      <div className="flex w-full items-center justify-center gap-1.5 my-3 sm:w-fit sm:justify-start sm:mx-0">
                        <span className="h-[1.5px] w-7 bg-gradient-to-r from-transparent to-amber-500" />
                        <span className="text-amber-500 text-[7px]">◆</span>
                        <span className="h-[1.5px] w-7 bg-gradient-to-l from-transparent to-amber-500" />
                      </div>

                      <p className="text-[12.5px] italic text-amber-700/80 tracking-wide">
                        {item.tagline}
                      </p>

                      <p className="mx-auto mt-2 max-w-[220px] text-[12px] leading-relaxed text-neutral-500 sm:mx-0">
                        {item.description}
                      </p>
                    </div>

                    {/* Product Image */}
                    <div className="flex w-[140px] shrink-0 items-center justify-center sm:w-[160px]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-auto max-w-full drop-shadow-md transition-transform duration-500 group-hover/card:scale-105"
                      />
                    </div>
                  </div>

                  {/* ── Bottom: Button ── */}
                  <button
                    type="button"
                    disabled={isActive}
                    onClick={(e) => handleClick(e, item)}
                    className={`
                      group relative mx-auto inline-flex
                      w-fit
                      items-center justify-center gap-2.5
                      overflow-hidden
                      whitespace-nowrap
                      rounded-full
                      border border-amber-700/70
                      px-6 py-2.5
                      text-[10.5px] font-semibold tracking-[0.18em]
                      text-amber-800
                      leading-none

                      transition-all duration-300
                      hover:shadow-[0_3px_16px_-4px_rgba(180,131,20,0.4)]

                      active:scale-95

                      ${isActive ? "cursor-default" : "cursor-pointer"}
                    `}
                  >
                    {/* Fill animation */}
                    <span
                      className={`
                        absolute inset-0
                        origin-left
                        bg-gradient-to-r from-amber-700 to-amber-800

                        transition-transform
                        duration-[350ms]
                        ease-in-out

                        ${
                          isActive
                            ? "translate-x-0"
                            : "-translate-x-full group-hover:translate-x-0"
                        }
                      `}
                    ></span>

                    {/* Button text */}
                    <span
                      className={`
                        relative z-10
                        transition-colors duration-200
                        ${isActive ? "text-white" : "group-hover:text-white"}
                      `}
                    >
                      {item.buttonText}
                    </span>

                    {/* Diamond */}
                    <span
                      className={`
                        relative z-10 text-[7px]
                        transition-colors duration-200
                        ${isActive ? "text-amber-300" : "text-amber-500 group-hover:text-amber-300"}
                      `}
                    >
                      ◆
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}