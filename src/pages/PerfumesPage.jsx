import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { perfumeProducts, filterOptions } from "../data";
import { ProductCard } from "../components/ProductCard";
import { FilterGroup } from "../components/FilterGroup";

const PAGE_SIZE = 8;

export function PerfumesPage() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFamilies, setSelectedFamilies] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [sortBy, setSortBy] = useState("popularity");
  const [currentPage, setCurrentPage] = useState(1);

  const toggleValue = (value, list, setList) => {
    setCurrentPage(1);
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    );
  };

  const filteredProducts = useMemo(() => {
    let result = perfumeProducts.filter((p) => {
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(p.category);
      const matchesFamily =
        selectedFamilies.length === 0 || selectedFamilies.includes(p.family);
      const matchesSize =
        selectedSizes.length === 0 || selectedSizes.includes(p.size);
      const matchesPrice =
        selectedPriceRanges.length === 0 ||
        selectedPriceRanges.some((label) => {
          const range = filterOptions.priceRanges.find((r) => r.label === label);
          return p.price >= range.min && p.price <= range.max;
        });
      return matchesCategory && matchesFamily && matchesSize && matchesPrice;
    });

    if (sortBy === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result = [...result].sort((a, b) => b.rating - a.rating);

    return result;
  }, [selectedCategories, selectedFamilies, selectedSizes, selectedPriceRanges, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="w-full">
      {/* Banner */}
      <div className="w-full bg-amber-50/40">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 px-6 py-10 md:flex-row md:px-14">
          <div className="text-center md:text-left">
            <h1 className="font-serif text-4xl text-neutral-800">PERFUMES</h1>
            <p className="mt-3 max-w-sm text-sm text-neutral-500">
              Luxury fragrances crafted to leave a lasting impression.
            </p>
            <button className="mt-5 rounded-full border border-amber-700 px-6 py-2.5 text-xs font-medium tracking-wide text-amber-700 transition-colors hover:bg-amber-700 hover:text-white">
              EXPLORE PERFUMES
            </button>
          </div>
          <img
            src={perfumeProducts[0].image}
            alt="Perfumes"
            className="h-auto max-w-[200px] md:ml-auto"
          />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mx-auto flex max-w-[1440px] items-center gap-1 px-6 py-4 text-xs text-neutral-500 md:px-14">
        <Link to="/" className="hover:text-amber-700">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-neutral-800">Perfumes</span>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 pb-16 md:flex-row md:px-14">
        {/* Sidebar filters */}
        <aside className="w-full flex-shrink-0 md:w-64">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-lg text-neutral-800">Filters</h2>
            <button
              onClick={() => {
                setSelectedCategories([]);
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

          <FilterGroup title="Category">
            {filterOptions.categories.map((cat) => (
              <FilterCheckbox
                key={cat}
                label={cat}
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleValue(cat, selectedCategories, setSelectedCategories)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Fragrance Family">
            {filterOptions.families.map((fam) => (
              <FilterCheckbox
                key={fam}
                label={fam}
                checked={selectedFamilies.includes(fam)}
                onChange={() => toggleValue(fam, selectedFamilies, setSelectedFamilies)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Price">
            {filterOptions.priceRanges.map((range) => (
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
            {filterOptions.sizes.map((size) => (
              <FilterCheckbox
                key={size}
                label={size}
                checked={selectedSizes.includes(size)}
                onChange={() => toggleValue(size, selectedSizes, setSelectedSizes)}
              />
            ))}
          </FilterGroup>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          <div className="mb-6 flex flex-col gap-3 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-serif text-2xl text-neutral-800">Perfumes</h1>
              <p className="text-sm text-neutral-500">
                Discover our exclusive range of luxury perfumes.
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
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
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