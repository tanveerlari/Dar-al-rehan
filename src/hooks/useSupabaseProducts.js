import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export function useSupabaseProducts() {
  const [supabaseProducts, setSupabaseProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from("products").select("*");

      if (!error && data) {
        const mapped = data.map((p) => ({
          id: p.id,
          type: p.type,
          name: p.name,
          notes: p.notes,
          price: p.price,
          oldPrice: p.old_price,
          discount: p.discount || 0,
          rating: p.rating || 4.5,
          reviews: p.reviews || 0,
          family: p.family,
          size: p.size,
          category: p.category,
          description: p.description,
          image: p.image,
          image2: p.image2,
        }));
        setSupabaseProducts(mapped);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return { supabaseProducts, loading };
}