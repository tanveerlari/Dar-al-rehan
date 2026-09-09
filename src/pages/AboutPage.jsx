import { Link } from "react-router-dom";
import { Phone, Mail, ChevronRight } from "lucide-react";

export function AboutPage() {
  return (
    <div className="w-full">
      {/* Banner */}
      <div className="w-full bg-amber-50/40">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-4 px-6 py-10 text-center md:px-14">
          <h1 className="font-serif text-4xl text-neutral-800">ABOUT US</h1>
          <p className="max-w-lg text-sm text-neutral-500">
            Dar Al Rehan — Perfumes & Attar. Scents that speak memories, crafted with royal
            tradition and timeless elegance.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mx-auto flex max-w-[1440px] items-center gap-1 px-6 py-4 text-xs text-neutral-500 md:px-14">
        <Link to="/" className="hover:text-amber-700">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-neutral-800">About Us</span>
      </div>

      {/* About content */}
      <div className="mx-auto max-w-[1440px] px-6 py-10 md:px-14">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-2xl text-neutral-800">Our Story</h2>
          <div className="mx-auto my-3 h-0.5 w-10 bg-amber-700"></div>
          <p className="text-sm leading-relaxed text-neutral-600">
            Dar Al Rehan brings together the art of perfumery and the timeless tradition of
            attar-making. Every bottle is crafted with the finest ingredients, blending royal
            craftsmanship with modern elegance — made for moments that last forever.
          </p>
        </div>
      </div>

      {/* Contact Us section */}
      <div className="w-full border-t border-neutral-200 bg-amber-50/30">
        <div className="mx-auto max-w-[1440px] px-6 py-12 text-center md:px-14">
          <h2 className="font-serif text-2xl text-neutral-800">Contact Us</h2>
          <div className="mx-auto my-3 h-0.5 w-10 bg-amber-700"></div>
          <p className="mx-auto mb-8 max-w-md text-sm text-neutral-500">
            Have a question or want to know more about our fragrances? Reach out to us.
          </p>

          <div className="mx-auto flex max-w-md flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-700/10">
                <Phone className="h-5 w-5 text-amber-700" />
              </div>
              <div className="text-left">
                <p className="text-xs text-neutral-500">Call us</p>
                <p className="text-sm font-medium text-neutral-800">+91 8983284487</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-700/10">
                <Mail className="h-5 w-5 text-amber-700" />
              </div>
              <div className="text-left">
                <p className="text-xs text-neutral-500">Email us</p>
                <p className="text-sm font-medium text-neutral-800">—</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}