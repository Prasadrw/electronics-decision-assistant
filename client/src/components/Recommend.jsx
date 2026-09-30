import { useState } from "react";
import { api, CATEGORIES } from "../api.js";
import ProductCard from "./ProductCard.jsx";

const PRIORITIES = [
  ["performance", "Performance"],
  ["battery", "Battery life"],
  ["camera", "Camera"],
  ["display", "Display"],
  ["value", "Value for money"],
];

export default function Recommend({ selected, onToggle }) {
  const [form, setForm] = useState({ category: "Smartphone", budget: 40000, priority: "performance" });
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const qs = new URLSearchParams(form).toString();
      setResults(await api(`/products/recommend?${qs}`));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <form className="card filters" onSubmit={submit}>
        <select name="category" value={form.category} onChange={change}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input name="budget" type="number" placeholder="Budget (₹)" value={form.budget} onChange={change} required />
        <select name="priority" value={form.priority} onChange={change}>
          {PRIORITIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <button className="btn">Get recommendations</button>
      </form>

      {error && <p className="error">{error}</p>}
      {results && results.length === 0 && <p className="muted">Nothing found in this budget. Try increasing it.</p>}

      <div className="grid">
        {results?.map((p) => (
          <ProductCard key={p._id} product={p} isSelected={!!selected.find((s) => s._id === p._id)} onToggle={onToggle} />
        ))}
      </div>
    </>
  );
}
