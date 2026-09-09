import perfumesImg from "./assets/perfumes.png";
import attarImg from "./assets/attar.png";

export const products = [
  {
    id: 1,
    title: "PERFUMES",
    tagline: "Elegant. Refined. Unforgettable.",
    description: "Discover our luxury perfume collection crafted to leave a lasting impression.",
    buttonText: "SHOP PERFUMES",
    image: perfumesImg,
    link: "/perfumes",
  },
  {
    id: 2,
    title: "ATTAR",
    tagline: "Pure. Authentic. Timeless.",
    description: "Explore our exquisite attars made from the finest ingredients.",
    buttonText: "SHOP ATTAR",
    image: attarImg,
    link: "/attar",
  },
];

export const features = [
  { id: 1, icon: "sparkles", title: "PREMIUM QUALITY", description: "Finest ingredients sourced globally" },
  { id: 2, icon: "clock", title: "LONG LASTING", description: "Scents that stay with you" },
  { id: 3, icon: "gift", title: "EXQUISITE PACKAGING", description: "Luxury in every detail" },
  { id: 4, icon: "shield", title: "AUTHENTIC & TRUSTED", description: "Crafted with tradition, trusted by thousands" },
];

export const navLinks = [
  { label: "HOME", path: "/" },
  { label: "SHOP", path: "/shop" },
  { label: "PERFUMES", path: "/perfumes" },
  { label: "ATTAR", path: "/attar" },
  { label: "COLLECTIONS", path: "/collections" },
  { label: "ABOUT", path: "/about" },
];

// ---- Perfumes listing page data ----

export const perfumeProducts = [
  { id: 1, type: "Perfume", name: "Royal Musk", notes: "Woody, Musky, Amber", price: 2399, oldPrice: 2999, discount: 20, rating: 4.5, reviews: 126, category: "Eau de Parfum", family: "Woody", size: "50 ml", image: perfumesImg },
  { id: 2, type: "Perfume", name: "Oud Al Rehan", notes: "Oud, Woody, Spicy", price: 3399, oldPrice: 3999, discount: 15, rating: 4.5, reviews: 98, category: "Extrait de Parfum", family: "Oriental", size: "50 ml", image: perfumesImg },
  { id: 3, type: "Perfume", name: "Amber Noir", notes: "Amber, Vanilla, Woody", price: 2249, oldPrice: 2499, discount: 10, rating: 4.5, reviews: 76, category: "Eau de Parfum", family: "Oriental", size: "30 ml", image: perfumesImg },
  { id: 4, type: "Perfume", name: "Velvet Oud", notes: "Oud, Leather, Woody", price: 2249, oldPrice: 3299, discount: 32, rating: 4.5, reviews: 78, category: "Extrait de Parfum", family: "Woody", size: "50 ml", image: perfumesImg },
  { id: 5, type: "Perfume", name: "Sandal Royale", notes: "Sandalwood, Spicy, Amber", price: 2049, oldPrice: 2499, discount: 18, rating: 4.5, reviews: 85, category: "Parfum", family: "Woody", size: "50 ml", image: perfumesImg },
  { id: 6, type: "Perfume", name: "Midnight Elixir", notes: "Citrus, Aromatic, Woody", price: 1849, oldPrice: 2099, discount: 12, rating: 4.5, reviews: 63, category: "Eau de Parfum", family: "Citrus", size: "30 ml", image: perfumesImg },
  { id: 7, type: "Perfume", name: "Desert Smoke", notes: "Woody, Smoky, Amber", price: 2974, oldPrice: 3499, discount: 15, rating: 4.5, reviews: 91, category: "Extrait de Parfum", family: "Woody", size: "100 ml", image: perfumesImg },
  { id: 8, type: "Perfume", name: "Eternal Noir", notes: "Oriental, Spicy, Woody", price: 2974, oldPrice: 3499, discount: 20, rating: 4.5, reviews: 71, category: "Parfum", family: "Oriental", size: "50 ml", image: perfumesImg },
];

export const filterOptions = {
  categories: ["Eau de Parfum", "Extrait de Parfum", "Parfum"],
  families: ["Woody", "Floral", "Oriental", "Fresh", "Citrus", "Spicy", "Aromatic"],
  sizes: ["30 ml", "50 ml", "100 ml"],
  priceRanges: [
    { label: "Under ₹1,999", min: 0, max: 1999 },
    { label: "₹1,999 - ₹3,999", min: 1999, max: 3999 },
    { label: "₹4,000 - ₹6,999", min: 4000, max: 6999 },
    { label: "₹7,000 & above", min: 7000, max: Infinity },
  ],
};

// ---- Attar listing page data ----

export const attarProducts = [
  { id: 1, type: "Attar", name: "Oudh Al Haramain", notes: "Deep, Woody, Rich", price: 1199, oldPrice: 1499, discount: 20, rating: 4.5, reviews: 128, category: "Oud Attar", family: "Woody", size: "12 ml", image: attarImg },
  { id: 2, type: "Attar", name: "Musk Al Tahara", notes: "Pure Musk, Soft, Clean", price: 999, oldPrice: 1199, discount: 15, rating: 4.5, reviews: 106, category: "Floral Attar", family: "Floral", size: "6 ml (Roll On)", image: attarImg },
  { id: 3, type: "Attar", name: "Rasasi Chandan", notes: "Sandalwood, Warm, Woody", price: 1149, oldPrice: 1299, discount: 10, rating: 4.5, reviews: 87, category: "Woody Attar", family: "Woody", size: "12 ml", image: attarImg },
  { id: 4, type: "Attar", name: "Oud Al Rehan", notes: "Woody, Smoky, Intense", price: 1499, oldPrice: 1799, discount: 15, rating: 4.5, reviews: 95, category: "Oud Attar", family: "Oriental", size: "24 ml", image: attarImg },
  { id: 5, type: "Attar", name: "Jannat Ul Firdaus", notes: "Floral, Sweet, Fresh", price: 899, oldPrice: 1029, discount: 12, rating: 4.5, reviews: 71, category: "Floral Attar", family: "Fresh", size: "6 ml (Roll On)", image: attarImg },
  { id: 6, type: "Attar", name: "Sandal Al Rehan", notes: "Sandalwood, Smooth, Warm", price: 1049, oldPrice: 1279, discount: 16, rating: 4.5, reviews: 61, category: "Woody Attar", family: "Woody", size: "12 ml", image: attarImg },
  { id: 7, type: "Attar", name: "Amber Attar", notes: "Amber, Warm, Resinous", price: 1299, oldPrice: 1449, discount: 10, rating: 4.5, reviews: 68, category: "Fresh Attar", family: "Oriental", size: "12 ml", image: attarImg },
  { id: 8, type: "Attar", name: "Misk Al Arabian", notes: "White Musk, Soft, Powdery", price: 1199, oldPrice: 1399, discount: 15, rating: 4.5, reviews: 92, category: "Spicy Attar", family: "Spicy", size: "6 ml (Roll On)", image: attarImg },
];

export const attarFilterOptions = {
  categories: ["Floral Attar", "Woody Attar", "Oud Attar", "Fresh Attar", "Spicy Attar"],
  families: ["Floral", "Woody", "Oriental", "Fresh", "Spicy"],
  sizes: ["6 ml (Roll On)", "12 ml", "24 ml"],
  priceRanges: [
    { label: "Under ₹999", min: 0, max: 999 },
    { label: "₹999 - ₹1,999", min: 999, max: 1999 },
    { label: "₹2,000 - ₹3,499", min: 2000, max: 3499 },
    { label: "₹3,500 & above", min: 3500, max: Infinity },
  ],
};

export const collectionsProducts = [...perfumeProducts, ...attarProducts];

export const collectionsFilterOptions = {
  types: ["Perfume", "Attar"],
  families: ["Woody", "Floral", "Oriental", "Fresh", "Citrus", "Spicy", "Aromatic"],
  sizes: ["6 ml (Roll On)", "12 ml", "24 ml", "30 ml", "50 ml", "100 ml"],
  priceRanges: [
    { label: "Under ₹999", min: 0, max: 999 },
    { label: "₹999 - ₹1,999", min: 999, max: 1999 },
    { label: "₹1,999 - ₹3,999", min: 1999, max: 3999 },
    { label: "₹4,000 & above", min: 4000, max: Infinity },
  ],
};

export const sampleReviews = [
  { name: "Aisha K.", rating: 5, comment: "Absolutely love this fragrance, lasts the whole day and smells so rich!", date: "2 weeks ago" },
  { name: "Rohan M.", rating: 4, comment: "Great scent, packaging is premium. Slightly strong for daily use but worth it.", date: "1 month ago" },
  { name: "Fatima S.", rating: 5, comment: "Best purchase I've made this year. Compliments every time I wear it.", date: "3 weeks ago" },
];