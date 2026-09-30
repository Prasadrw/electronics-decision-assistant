import { useState } from "react";
import { api, CATEGORIES } from "../api.js";

const empty = {
  name: "", brand: "", category: "Smartphone", price: "", rating: 4,
  processor: "", ram: "", storage: "", battery: "", display: "", camera: "",
  performance: 5, batteryScore: 5, cameraScore: 5, displayScore: 5,
};

export default function AddProduct({ token, onDone }) {
  const [f, setF] = useState(empty);
  const [error, setError] = useState("");

  const change = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api("/products", {
        method: "POST",
        token,
        body: {
          name: f.name, brand: f.brand, category: f.category,
          price: Number(f.price), rating: Number(f.rating),
          specs: {
            processor: f.processor, ram: f.ram, storage: f.storage,
            battery: f.battery, display: f.display, camera: f.camera,
          },
          scores: {
            performance: Number(f.performance), battery: Number(f.batteryScore),
            camera: Number(f.cameraScore), display: Number(f.displayScore),
          },
        },
      });
      onDone();
    } catch (err) {
      setError(err.message);
    }
  };

  const text = (name, label, type = "text", extra = {}) => (
    <label>
      {label}
      <input name={name} type={type} value={f[name]} onChange={change} {...extra} />
    </label>
  );

  return (
    <form className="card form-grid" onSubmit={submit}>
      {text("name", "Name", "text", { required: true })}
      {text("brand", "Brand", "text", { required: true })}
      <label>
        Category
        <select name="category" value={f.category} onChange={change}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      {text("price", "Price (₹)", "number", { required: true, min: 0 })}
      {text("rating", "Rating (0-5)", "number", { min: 0, max: 5, step: 0.1 })}
      {text("processor", "Processor")}
      {text("ram", "RAM")}
      {text("storage", "Storage")}
      {text("battery", "Battery")}
      {text("display", "Display")}
      {text("camera", "Camera")}
      {text("performance", "Performance score (1-10)", "number", { min: 1, max: 10 })}
      {text("batteryScore", "Battery score (1-10)", "number", { min: 1, max: 10 })}
      {text("cameraScore", "Camera score (1-10)", "number", { min: 1, max: 10 })}
      {text("displayScore", "Display score (1-10)", "number", { min: 1, max: 10 })}
      {error && <p className="error full">{error}</p>}
      <button className="btn full">Save product</button>
    </form>
  );
}
