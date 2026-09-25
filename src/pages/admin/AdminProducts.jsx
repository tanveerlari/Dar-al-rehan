import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { Trash2, Plus, Upload, Pencil, X } from "lucide-react";

const emptyForm = {
  name: "",
  type: "Perfume",
  category: "",
  description: "",
  price: "",
  old_price: "",
  family: "",
  size: "",
  image: "",
  image2: "",
};

// Old price se new price kitna kam hai, % me
const calculateDiscount = (price, oldPrice) => {
  const p = Number(price);
  const o = Number(oldPrice);
  if (!p || !o || o <= p) return 0;
  return Math.round(((o - p) / o) * 100);
};

export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const discount = calculateDiscount(form.price, form.old_price);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("product-images").upload(fileName, file);

    if (error) {
      alert("Image upload failed: " + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
    setForm((prev) => ({ ...prev, [fieldName]: data.publicUrl }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      alert("Please upload an image first.");
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      old_price: form.old_price ? Number(form.old_price) : null,
      discount: calculateDiscount(form.price, form.old_price),
    };

    if (editingId) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingId);
      if (error) {
        alert("Failed to update: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("products").insert([payload]);
      if (error) {
        alert("Failed to add product: " + error.message);
        return;
      }
    }

    setForm(emptyForm);
    setEditingId(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name || "",
      type: product.type || "Perfume",
      category: product.category || "",
      description: product.description || "",
      price: product.price || "",
      old_price: product.old_price || "",
      family: product.family || "",
      size: product.size || "",
      image: product.image || "",
      image2: product.image2 || "",
    });
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-neutral-800">Products</h1>

      <form onSubmit={handleSubmit} className="mb-10 rounded-md border border-neutral-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-700">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex items-center gap-1 text-xs text-neutral-500 hover:text-red-600"
            >
              <X className="h-3.5 w-3.5" /> Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Product name" required className="rounded border border-neutral-300 px-3 py-2 text-sm" />

          <select name="type" value={form.type} onChange={handleChange} className="rounded border border-neutral-300 px-3 py-2 text-sm">
            <option value="Perfume">Perfume</option>
            <option value="Attar">Attar</option>
            <option value="Collection">Collection</option>
          </select>

          <input name="category" value={form.category} onChange={handleChange} placeholder="Category (e.g. Eau de Parfum)" required className="rounded border border-neutral-300 px-3 py-2 text-sm" />

          <input name="family" value={form.family} onChange={handleChange} placeholder="Fragrance Family" required className="rounded border border-neutral-300 px-3 py-2 text-sm" />

          <input name="size" value={form.size} onChange={handleChange} placeholder="Size (e.g. 50 ml)" required className="rounded border border-neutral-300 px-3 py-2 text-sm" />

          <input name="price" value={form.price} onChange={handleChange} placeholder="Price (₹)" type="number" required className="rounded border border-neutral-300 px-3 py-2 text-sm" />

          <input name="old_price" value={form.old_price} onChange={handleChange} placeholder="Old Price (optional)" type="number" className="rounded border border-neutral-300 px-3 py-2 text-sm" />

          {/* Auto-calculated, user can't type here */}
          <div className="flex items-center justify-between rounded border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500">
            <span>Discount (auto)</span>
            <span className={discount > 0 ? "font-semibold text-emerald-700" : ""}>
              {discount > 0 ? `${discount}% OFF` : "—"}
            </span>
          </div>
        </div>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Full product description..."
          rows={3}
          required
          className="mt-4 w-full rounded border border-neutral-300 px-3 py-2 text-sm"
        />

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Primary Image */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-neutral-600">Primary Product Image (Required)</label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-neutral-300 px-3 py-6 text-sm text-neutral-500 hover:border-amber-600">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : form.image ? "Primary image uploaded ✓" : "Upload primary image"}
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image')} className="hidden" />
            </label>
            {form.image && <img src={form.image} alt="preview" className="mt-2 h-16 w-16 rounded border object-contain p-1" />}
          </div>

          {/* Details / Second Image */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-neutral-600">Details / Banner Image (Optional)</label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-neutral-300 px-3 py-6 text-sm text-neutral-500 hover:border-amber-600">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : form.image2 ? "Details image uploaded ✓" : "Upload second image (Details/Banner)"}
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image2')} className="hidden" />
            </label>
            {form.image2 && <img src={form.image2} alt="preview" className="mt-2 h-16 w-16 rounded border object-contain p-1" />}
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="mt-4 flex items-center justify-center gap-2 rounded bg-amber-700 px-4 py-2 text-sm text-white hover:bg-amber-800 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-neutral-500">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="rounded-md border border-neutral-200 bg-white p-4">
              <img src={product.image} alt={product.name} className="mx-auto h-32 object-contain" />
              <h3 className="mt-3 text-sm font-semibold text-neutral-800">{product.name}</h3>
              <p className="text-xs text-neutral-500">{product.type} · {product.category}</p>
              <p className="text-xs text-neutral-500">₹{product.price} {product.discount > 0 && `(-${product.discount}%)`}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex flex-1 items-center justify-center gap-1 rounded border border-neutral-300 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex flex-1 items-center justify-center gap-1 rounded border border-red-300 py-1.5 text-xs text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}