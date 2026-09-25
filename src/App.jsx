import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "./components/Navbar";
import { ScrollToTop } from "./components/ScrollToTop";
import { Hero } from "./components/Hero";
import { ProductsSection } from "./components/ProductsSection";
import { Features } from "./components/Features";
import { PerfumesPage } from "./pages/PerfumesPage";
import { AttarPage } from "./pages/AttarPage";
import { FloraBellePage } from "./pages/FloraBellePage";
import { CollectionsPage } from "./pages/CollectionsPage";
import { ShopPage } from "./pages/ShopPage";
import { AboutPage } from "./pages/AboutPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { CartToast } from "./components/CartToast";
import { WelcomeAuthModal } from "./components/WelcomeAuthModal";
import { PhoneAuthModal } from "./components/PhoneAuthModal";
import { OpeningOfferBanner } from "./components/OpeningOfferBanner";

import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProducts } from "./pages/admin/AdminProducts";
import { AdminOrders } from "./pages/admin/AdminOrders";
import { AdminCustomers } from "./pages/admin/AdminCustomers";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute";

function HomePage() {
  return (
    <>
      <Hero />
      <OpeningOfferBanner />
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

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
          <Route path="/shop" element={<PageWrapper><ShopPage /></PageWrapper>} />
          <Route path="/perfumes" element={<PageWrapper><PerfumesPage /></PageWrapper>} />
          <Route path="/attar" element={<PageWrapper><AttarPage /></PageWrapper>} />
          <Route path="/collections" element={<PageWrapper><CollectionsPage /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
          <Route path="/product/:type/:id" element={<PageWrapper><ProductDetailPage /></PageWrapper>} />
          <Route path="/cart" element={<PageWrapper><CartPage /></PageWrapper>} />
          <Route path="/checkout" element={<PageWrapper><CheckoutPage /></PageWrapper>} />
          <Route path="/collections/flora-belle" element={<FloraBellePage />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
          </Route>
        </Routes>
      </AnimatePresence>
      {!isAdminRoute && (
        <>
          <CartToast />
          <WelcomeAuthModal />
          <PhoneAuthModal />
        </>
      )}
    </>
  );
}

export default App;