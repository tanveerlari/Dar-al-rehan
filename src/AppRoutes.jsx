import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { Hero } from "./components/Hero";
import { ProductsSection } from "./components/ProductsSection";
import { Features } from "./components/Features";
import { PerfumesPage } from "./pages/PerfumesPage";
import { AttarPage } from "./pages/AttarPage";
import { CollectionsPage } from "./pages/CollectionsPage";
import { ShopPage } from "./pages/ShopPage";
import { AboutPage } from "./pages/AboutPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";

function HomePage() {
  return (
    <>
      <Hero />
      <ProductsSection />
      <Features />
    </>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export function AppRoutes({ location }) {
  return (
    <Routes location={location}>
      <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
      <Route path="/shop" element={<PageWrapper><ShopPage /></PageWrapper>} />
      <Route path="/perfumes" element={<PageWrapper><PerfumesPage /></PageWrapper>} />
      <Route path="/attar" element={<PageWrapper><AttarPage /></PageWrapper>} />
      <Route path="/collections" element={<PageWrapper><CollectionsPage /></PageWrapper>} />
      <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
      <Route path="/product/:type/:id" element={<PageWrapper><ProductDetailPage /></PageWrapper>} />
      <Route path="/cart" element={<PageWrapper><CartPage /></PageWrapper>} />
      <Route path="/checkout" element={<PageWrapper><CheckoutPage /></PageWrapper>} />
    </Routes>
  );
}