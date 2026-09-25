import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { collectionsProducts, collectionsFilterOptions } from "../data";
import { ProductCard } from "../components/ProductCard";
import { FilterGroup } from "../components/FilterGroup";
import { FilterSidebar } from "../components/FilterSidebar";
import { SortDropdown } from "../components/SortDropdown";
import collectionsBannerImg from "../assets/collectionsimg.png";
import { useSupabaseProducts } from "../hooks/useSupabaseProducts";

const PAGE_SIZE = 8;

export function CollectionsPage() {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedFamilies, setSelectedFamilies] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [sortBy, setSortBy] = useState("popularity");
  const [currentPage, setCurrentPage] = useState(1);
  const { supabaseProducts } = useSupabaseProducts();
  const allProducts = useMemo(
    () => supabaseProducts.filter((p) => p.type === "Collection"),
    [supabaseProducts]
  );

  const toggleValue = (value, list, setList) => {
    setCurrentPage(1);
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const filteredProducts = useMemo(() => {
    let result = allProducts.filter((p) => {
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(p.type);
      const matchesFamily =
        selectedFamilies.length === 0 || selectedFamilies.includes(p.family);
      const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(p.size);
      const matchesPrice =
        selectedPriceRanges.length === 0 ||
        selectedPriceRanges.some((label) => {
          const range = collectionsFilterOptions.priceRanges.find((r) => r.label === label);
          return p.price >= range.min && p.price <= range.max;
        });
      return matchesType && matchesFamily && matchesSize && matchesPrice;
    });

    if (sortBy === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result = [...result].sort((a, b) => b.rating - a.rating);

    return result;
  }, [allProducts, selectedTypes, selectedFamilies, selectedSizes, selectedPriceRanges, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="w-full">
      {/* Animated Collections Banner - Screen se halka sa gap aur rounded borders */}
      <div className="w-full px-3 sm:px-5 md:px-8 pt-3 pb-2 overflow-hidden">
        <div className="relative w-full overflow-hidden rounded-xl md:rounded-2xl shadow-md">
          <img
            src={collectionsBannerImg}
            alt="Collections - Dar Al Rehan"
            fetchPriority="high"
            loading="eager"
            className="block w-full h-auto max-h-[85vh] object-cover object-center animate-hero-reveal"
          />
          {/* Subtle Luxury Gradient Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mx-auto flex max-w-[1440px] items-center gap-1 px-6 py-3 text-xs text-neutral-500 sm:py-4 md:px-14">
        <Link to="/" className="hover:text-amber-700">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-neutral-800">Collections</span>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-6 pb-16 md:flex-row md:gap-8 md:px-14">
        {/* Filters: phone pe drawer, desktop pe sidebar */}
        <FilterSidebar
          activeCount={
            selectedTypes.length +
            selectedFamilies.length +
            selectedSizes.length +
            selectedPriceRanges.length
          }
          onClear={() => {
            setSelectedTypes([]);
            setSelectedFamilies([]);
            setSelectedSizes([]);
            setSelectedPriceRanges([]);
            setCurrentPage(1);
          }}
        >
          {/* Removed Type filter since Collections page only shows Collections */}

          <FilterGroup title="Fragrance Family">
            {collectionsFilterOptions.families.map((fam) => (
              <FilterCheckbox
                key={fam}
                label={fam}
                checked={selectedFamilies.includes(fam)}
                onChange={() =>
                  toggleValue(fam, selectedFamilies, setSelectedFamilies)
                }
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Price">
            {collectionsFilterOptions.priceRanges.map((range) => (
              <FilterCheckbox
                key={range.label}
                label={range.label}
                checked={selectedPriceRanges.includes(range.label)}
                onChange={() =>
                  toggleValue(
                    range.label,
                    selectedPriceRanges,
                    setSelectedPriceRanges
                  )
                }
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Size">
            {collectionsFilterOptions.sizes.map((size) => (
              <FilterCheckbox
                key={size}
                label={size}
                checked={selectedSizes.includes(size)}
                onChange={() =>
                  toggleValue(size, selectedSizes, setSelectedSizes)
                }
              />
            ))}
          </FilterGroup>
        </FilterSidebar>

        {/* Product grid */}
        <div className="flex-1">
          <div className="mb-3 flex flex-col gap-2 sm:mb-6 sm:gap-3 sm:border-b sm:border-neutral-200 sm:pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-serif text-2xl text-neutral-800">
                All Collections
              </h1>

              <p className="text-sm text-neutral-500">
                Browse our full range of perfumes and attars together.
              </p>
            </div>

            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          {filteredProducts.length === 0 ? (
            <p className="py-12 text-center text-sm text-neutral-500">
              {allProducts.length === 0
                ? "Our collection is coming soon."
                : "No products match the selected filters."}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={`${product.routeType || product.type}-${product.id}`}
                  product={product}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
                }
                className="rounded border border-neutral-300 px-3 py-1.5 text-sm text-neutral-600 disabled:opacity-40"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
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
                )
              )}

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
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