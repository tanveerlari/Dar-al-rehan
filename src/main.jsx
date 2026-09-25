import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { CartProvider } from "./components/CartContext";
import { CustomerAuthProvider } from "./components/CustomerAuthContext";
import { AdminAuthProvider } from "./components/AdminAuthContext";
import "./global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
<BrowserRouter>
  <CartProvider>
    <CustomerAuthProvider>
      <AdminAuthProvider>
          <App />
      </AdminAuthProvider>
    </CustomerAuthProvider>
  </CartProvider>
</BrowserRouter>
  </React.StrictMode>
);