import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ImageGallery({ images, alt }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  if (!images || images.length === 0) return null;

  const goPrev = () => {
    setDirection(-1);
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const goNext = () => {
    setDirection(1);
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  const goTo = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Main image with arrows */}
      <div className="relative flex items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-amber-50/30 p-10">
        <div className="relative h-72 w-full">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt={alt}
              custom={direction}
              initial={(dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 })}
              animate={{ x: 0, opacity: 1 }}
              exit={(dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 })}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 h-full w-full object-contain"
            />
          </AnimatePresence>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-neutral-700 shadow-md transition-colors hover:bg-amber-700 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-neutral-700 shadow-md transition-colors hover:bg-amber-700 hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex justify-center gap-3">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 p-1 transition-colors ${
                activeIndex === index ? "border-amber-700" : "border-neutral-200"
              }`}
            >
              <img src={img} alt={`${alt} ${index + 1}`} className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}