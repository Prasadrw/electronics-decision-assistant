import { inr } from "../api.js";

export default function ProductCard({ product, isSelected, onToggle, onDelete, canDelete }) {
  const { name, brand, category, price, rating, specs = {}, match } = product;
  return (
    <div className={isSelected ? "card product selected" : "card product"}>
      <div className="row between">
        <span className="badge">{category}</span>
        {match !== undefined && <span className="badge green">{match}% match</span>}
      </div>
      <h3>{name}</h3>
      <p className="muted">{brand} • ⭐ {rating}</p>
      <p className="price">{inr(price)}</p>
      <ul className="specs">
        {["processor", "ram", "storage", "battery", "display", "camera"].map(
          (k) => specs[k] && specs[k] !== "-" && <li key={k}><b>{k}:</b> {specs[k]}</li>
        )}
      </ul>
      <div className="row">
        <button className={isSelected ? "btn secondary" : "btn"} onClick={() => onToggle(product)}>
          {isSelected ? "Remove from compare" : "Add to compare"}
        </button>
        {canDelete && <button className="btn danger" onClick={() => onDelete(product._id)}>Delete</button>}
      </div>
    </div>
  );
}
