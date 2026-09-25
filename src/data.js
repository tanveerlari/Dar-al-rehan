import perfumesImg from "./assets/perfumes.png";
import attarImg from "./assets/attar.png";
import floraBelleImg from "./assets/flora-belle.png";

import floraBelleBlueImg from "./assets/flora-belle-blue.png";
import floraBellePinkImg from "./assets/flora-belle-pink.png";

// Oud Zaryaan ke liye — group photo jisme saare bottle colors ek saath hain
import oudZaryaanBottlesImg from "./assets/oud-zaryaan-bottles.jpeg";
import oudZaryaanImg from "./assets/oud-zaryaan.png";
import oudZaryaanBannerImg from "./assets/oud-zaryaan-banner.jpeg";

export const floraBelleProducts = [
  {
    id: 1,
    routeType: "flora-belle",
    type: "Perfume",
    name: "Flora Belle - Azure",
    notes: "Fresh, Floral, Aquatic",
    price: 1999,
    oldPrice: 2499,
    discount: 20,
    rating: 4.5,
    reviews: 42,
    category: "Eau de Parfum",
    family: "Fresh",
    size: "30 ml",
    image: floraBelleBlueImg,
    imageScale: 1.3,
  },
  {
    id: 2,
    routeType: "flora-belle",
    type: "Perfume",
    name: "Flora Belle - Rose",
    notes: "Floral, Sweet, Powdery",
    price: 1999,
    oldPrice: 2499,
    discount: 20,
    rating: 4.5,
    reviews: 38,
    category: "Eau de Parfum",
    family: "Floral",
    size: "30 ml",
    image: floraBellePinkImg,
    imageScale: 1.3,
  },
];

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
  {
    id: 3,
    title: "FLORA BELLE",
    tagline: "For Women's ",
    description: "Two shades. One essence. Elegance in every drop, crafted for every mood and moment.",
    buttonText: "SHOP FLORA BELLE",
    image: floraBelleImg,
    link: "/collections/flora-belle",
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

export const perfumesBannerImg = perfumesImg;

export const perfumeProducts = [];

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

export const attarBannerImg = attarImg;

export const attarProducts = [
{
  id: 1,
  type: "Attar",
  name: "Oud Zaryaan",
  notes: "A rich and timeless attar crafted with deep oud notes, blending warmth, elegance, and lasting sophistication in every drop.",
  price: 559,
  oldPrice: 699,
  discount: 20,
  rating: 4.5,
  reviews: 0,
  category: "Oud Attar",
  family: "Woody",
  size: "12",
  image: oudZaryaanImg,
  bottleShowcaseImage: oudZaryaanBottlesImg,
  images: [oudZaryaanImg, oudZaryaanBannerImg],
},
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
  types: ["Perfume", "Attar", "Collection"],
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