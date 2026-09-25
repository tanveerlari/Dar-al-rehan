import bannerpage from "../assets/bannerpage.png";
import bannerpageMobile from "../assets/bannerpageMobile.png";

export function Hero() {
  return (
    <div className="w-full px-2 sm:px-4 md:px-6 pt-3 pb-6 overflow-hidden">
      <div className="relative w-full overflow-hidden rounded-xl md:rounded-2xl shadow-xl">
        <picture>
          {/* Phone: 767px tak portrait image */}
          <source media="(max-width: 767px)" srcSet={bannerpageMobile} />
          {/* Tablet / Desktop: purani banner */}
          <img
            src={bannerpage}
            alt="Dar Al Rehan - Perfumes & Attar"
            fetchPriority="high"
            loading="eager"
            className="block w-full h-auto md:max-h-[85vh] object-cover object-center animate-hero-reveal"
          />
        </picture>
        {/* Subtle Luxury Gradient Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>
    </div>
  );
}