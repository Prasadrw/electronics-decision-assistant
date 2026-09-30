import { useEffect, useState } from "react";
import { api, CATEGORIES } from "../api.js";
import ProductCard from "./ProductCard.jsx";

export default function Products({ token, user, selected, onToggle }) {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: "", brand: "", maxPrice: "", sort: "" });
  const [error, setError] = useState("");

  const change = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const load = async () => {
    try {
      const qs = new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString();
      setProducts(await api(`/products?${qs}`));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); }, [filters]); // reload when filters change

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api(`/products/${id}`, { method: "DELETE", token });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <div className="card filters">
        <input name="search" placeholder="Search by name" value={filters.search} onChange={change} />
        <select name="category" value={filters.category} onChange={change}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input name="brand" placeholder="Brand (e.g. Apple)" value={filters.brand} onChange={change} />
        <input name="maxPrice" type="number" placeholder="Max budget (₹)" value={filters.maxPrice} onChange={change} />
        <select name="sort" value={filters.sort} onChange={change}>
          <option value="">Newest</option>
          <option value="priceAsc">Price: low to high</option>
          <option value="priceDesc">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}
      {!error && products.length === 0 && <p className="muted">No products found. Did you run <code>npm run seed</code>?</p>}

      <div className="grid">
        {products.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            isSelected={!!selected.find((s) => s._id === p._id)}
            onToggle={onToggle}
            onDelete={remove}
            canDelete={p.createdBy && p.createdBy === user?.id}
          />
        ))}
      </div>
    </>
  );
}
