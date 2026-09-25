import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Sparkles, ShieldCheck, Clock } from "lucide-react";
import { attarProducts, attarFilterOptions } from "../data";
import attarBannerImg from "../assets/attar.png";
import { ProductCard } from "../components/ProductCard";
import { FilterGroup } from "../components/FilterGroup";
import { FilterSidebar } from "../components/FilterSidebar";
import { SortDropdown } from "../components/SortDropdown";
import { useSupabaseProducts } from "../hooks/useSupabaseProducts";

const PAGE_SIZE = 8;

export function AttarPage() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFamilies, setSelectedFamilies] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [sortBy, setSortBy] = useState("popularity");
  const [currentPage, setCurrentPage] = useState(1);
  const { supabaseProducts } = useSupabaseProducts();
  const allAttars = useMemo(
    () => [...attarProducts, ...supabaseProducts.filter((p) => p.type === "Attar")],
    [supabaseProducts]
  );

  const toggleValue = (value, list, setList) => {
    setCurrentPage(1);
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const filteredProducts = useMemo(() => {
    let result = allAttars.filter((p) => {
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const matchesFamily =
        selectedFamilies.length === 0 || selectedFamilies.includes(p.family);
      const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(p.size);
      const matchesPrice =
        selectedPriceRanges.length === 0 ||
        selectedPriceRanges.some((label) => {
          const range = attarFilterOptions.priceRanges.find((r) => r.label === label);
          return p.price >= range.min && p.price <= range.max;
        });
      return matchesCategory && matchesFamily && matchesSize && matchesPrice;
    });

    if (sortBy === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result = [...result].sort((a, b) => b.rating - a.rating);

    return result;
  }, [allAttars, selectedCategories, selectedFamilies, selectedSizes, selectedPriceRanges, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="w-full">
      {/* Luxury Royal Attar Banner - Subtle Screen Gap & Smooth Reveal */}
      <div className="w-full px-3 sm:px-5 md:px-8 pt-3 pb-2 overflow-hidden">
        <div className="relative w-full overflow-hidden rounded-xl md:rounded-2xl border border-amber-900/10 bg-gradient-to-br from-[#FAF6F0] via-[#F4EDE2] to-[#E9DEC9] shadow-md animate-hero-reveal">

          {/* Ambient Royal Gold Glow Circles */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-amber-300/25 blur-3xl" />
          <div className="pointer-events-none absolute right-1/4 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-amber-400/20 blur-3xl" />

          <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-8 px-6 py-10 sm:py-14 md:flex-row md:px-14">

            {/* Left Content */}
            <div className="text-center md:text-left max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-900/10 px-3.5 py-1 text-[11px] font-medium tracking-[0.2em] text-amber-800 border border-amber-900/15 mb-3 uppercase">
                <Sparkles className="h-3 w-3 text-amber-700" />
                Pure Natural Essence
              </span>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-neutral-900">
                ROYAL ATTAR
              </h1>

              <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                Handcrafted with pure botanical oils and traditional hydro-distillation. Experience an authentic, alcohol-free fragrance that lingers timelessly.
              </p>

              {/* Luxury Feature Pills */}
              <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-neutral-700">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-700" /> 100% Alcohol-Free
                </span>
                <span className="text-amber-900/30">•</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-amber-700" /> 24h+ Longevity
                </span>
              </div>

              <div className="mt-6 flex items-center justify-center md:justify-start">
                <a
                  href="#products-list"
                  className="rounded-full bg-neutral-900 px-7 py-2.5 text-xs font-medium tracking-wider text-white shadow-md transition-all duration-300 hover:bg-amber-800 hover:shadow-lg"
                >
                  EXPLORE ATTARS
                </a>
              </div>
            </div>

            {/* Right Showcase: Bottle Vitrine / Pedestal Presentation */}
            <div className="relative flex items-center justify-center">
              {/* Soft Golden Aura */}
              <div className="absolute h-52 w-52 rounded-full bg-amber-400/25 blur-2xl" />

              {/* Glass Vitrine Showcase Card */}
              <div className="relative flex items-center justify-center rounded-2xl border border-white/80 bg-white/55 p-6 shadow-xl backdrop-blur-md transition-transform duration-500 hover:scale-105">
                <img
                  src={attarBannerImg}
                  alt="Royal Attar"
                  fetchPriority="high"
                  loading="eager"
                  className="h-44 sm:h-56 md:h-60 w-auto object-contain drop-shadow-[0_15px_20px_rgba(120,53,15,0.2)] transition-all duration-500"
                />

                {/* Micro Tag on Bottle Frame */}
                <div className="absolute bottom-2 rounded-full bg-neutral-900/80 px-3 py-0.5 text-[10px] tracking-wider text-amber-200 backdrop-blur">
                  SIGNATURE BLEND
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mx-auto flex max-w-[1440px] items-center gap-1 px-6 py-3 text-xs text-neutral-500 sm:py-4 md:px-14">
        <Link to="/" className="hover:text-amber-700">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-neutral-800">Attar</span>
      </div>

      <div id="products-list" className="mx-auto flex max-w-[1440px] flex-col gap-4 px-6 pb-16 md:flex-row md:gap-8 md:px-14">
        {/* Filters: phone pe drawer, desktop pe sidebar */}
        <FilterSidebar
          activeCount={
            selectedCategories.length +
            selectedFamilies.length +
            selectedSizes.length +
            selectedPriceRanges.length
          }
          onClear={() => {
            setSelectedCategories([]);
            setSelectedFamilies([]);
            setSelectedSizes([]);
            setSelectedPriceRanges([]);
            setCurrentPage(1);
          }}
        >
          <FilterGroup title="Category">
            {attarFilterOptions.categories.map((cat) => (
              <FilterCheckbox
                key={cat}
                label={cat}
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleValue(cat, selectedCategories, setSelectedCategories)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Fragrance Family">
            {attarFilterOptions.families.map((fam) => (
              <FilterCheckbox
                key={fam}
                label={fam}
                checked={selectedFamilies.includes(fam)}
                onChange={() => toggleValue(fam, selectedFamilies, setSelectedFamilies)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Price">
            {attarFilterOptions.priceRanges.map((range) => (
              <FilterCheckbox
                key={range.label}
                label={range.label}
                checked={selectedPriceRanges.includes(range.label)}
                onChange={() =>
                  toggleValue(range.label, selectedPriceRanges, setSelectedPriceRanges)
                }
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Size">
            {attarFilterOptions.sizes.map((size) => (
              <FilterCheckbox
                key={size}
                label={size}
                checked={selectedSizes.includes(size)}
                onChange={() => toggleValue(size, selectedSizes, setSelectedSizes)}
              />
            ))}
          </FilterGroup>
        </FilterSidebar>

        {/* Product grid */}
        <div className="flex-1">
          <div className="mb-3 flex flex-col gap-2 sm:mb-6 sm:gap-3 sm:border-b sm:border-neutral-200 sm:pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-serif text-2xl text-neutral-800">Attar</h1>
              <p className="text-sm text-neutral-500">
                Pure & natural attars crafted with the finest ingredients.
              </p>
            </div>

            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          {filteredProducts.length === 0 ? (
            <p className="py-12 text-center text-sm text-neutral-500">
              {allAttars.length === 0
                ? "Our attar collection is coming soon."
                : "No products match the selected filters."}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded border border-neutral-300 px-3 py-1.5 text-sm text-neutral-600 disabled:opacity-40"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 rounded text-sm ${
                    currentPage === page
                      ? "bg-amber-700 text-white"
                      : "text-neutral-600 hover:bg-amber-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="rounded border border-neutral-300 px-3 py-1.5 text-sm text-neutral-600 disabled:opacity-40"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-amber-700"
      />
      {label}
    </label>
  );
}