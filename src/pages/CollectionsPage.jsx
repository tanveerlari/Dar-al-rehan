import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { collectionsProducts, collectionsFilterOptions } from "../data";
import { ProductCard } from "../components/ProductCard";
import { FilterGroup } from "../components/FilterGroup";
import collectionsBannerImg from "../assets/collectionsimg.png";

const PAGE_SIZE = 8;

export function CollectionsPage() {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedFamilies, setSelectedFamilies] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [sortBy, setSortBy] = useState("popularity");
  const [currentPage, setCurrentPage] = useState(1);

  const toggleValue = (value, list, setList) => {
    setCurrentPage(1);
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const filteredProducts = useMemo(() => {
    let result = collectionsProducts.filter((p) => {
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
  }, [selectedTypes, selectedFamilies, selectedSizes, selectedPriceRanges, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="w-full">

      {/* Banner */}
      <div className="w-full">
        <img
          src={collectionsBannerImg}
          alt="Collections - Dar Al Rehan"
          className="block h-auto w-full"
        />
      </div>

      {/* Breadcrumb */}
      <div className="mx-auto flex max-w-[1440px] items-center gap-1 px-6 py-4 text-xs text-neutral-500 md:px-14">
        <Link to="/" className="hover:text-amber-700">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-neutral-800">Collections</span>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 pb-16 md:flex-row md:px-14">

        {/* Sidebar filters */}
        <aside className="w-full flex-shrink-0 md:w-64">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-lg text-neutral-800">Filters</h2>

            <button
              onClick={() => {
                setSelectedTypes([]);
                setSelectedFamilies([]);
                setSelectedSizes([]);
                setSelectedPriceRanges([]);
                setCurrentPage(1);
              }}
              className="text-xs text-amber-700 hover:underline"
            >
              Clear All
            </button>
          </div>

          <FilterGroup title="Type">
            {collectionsFilterOptions.types.map((type) => (
              <FilterCheckbox
                key={type}
                label={type}
                checked={selectedTypes.includes(type)}
                onChange={() =>
                  toggleValue(type, selectedTypes, setSelectedTypes)
                }
              />
            ))}
          </FilterGroup>

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
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          <div className="mb-6 flex flex-col gap-3 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-serif text-2xl text-neutral-800">
                All Collections
              </h1>

              <p className="text-sm text-neutral-500">
                Browse our full range of perfumes and attars together.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-500">Sort by:</span>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 outline-none focus:border-amber-600"
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <p className="py-12 text-center text-sm text-neutral-500">
              No products match the selected filters.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={`${product.type}-${product.id}`}
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