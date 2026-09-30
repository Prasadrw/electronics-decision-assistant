import { inr } from "../api.js";

const SPEC_ROWS = ["processor", "ram", "storage", "battery", "display", "camera"];
const SCORE_ROWS = ["performance", "battery", "camera", "display"];

export default function Compare({ selected, onToggle }) {
  if (selected.length < 2) {
    return <p className="muted">Select at least 2 products (from Products or Recommend tab) to compare.</p>;
  }

  const lowestPrice = Math.min(...selected.map((p) => p.price));
  const bestRating = Math.max(...selected.map((p) => p.rating));

  return (
    <div className="card table-wrap">
      <table>
        <thead>
          <tr>
            <th></th>
            {selected.map((p) => (
              <th key={p._id}>
                {p.name}
                <br />
                <button className="link" onClick={() => onToggle(p)}>remove</button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Brand</td>
            {selected.map((p) => <td key={p._id}>{p.brand}</td>)}
          </tr>
          <tr>
            <td>Price</td>
            {selected.map((p) => <td key={p._id} className={p.price === lowestPrice ? "best" : ""}>{inr(p.price)}</td>)}
          </tr>
          <tr>
            <td>Rating</td>
            {selected.map((p) => <td key={p._id} className={p.rating === bestRating ? "best" : ""}>⭐ {p.rating}</td>)}
          </tr>
          {SPEC_ROWS.map((k) => (
            <tr key={k}>
              <td className="cap">{k}</td>
              {selected.map((p) => <td key={p._id}>{p.specs?.[k] || "-"}</td>)}
            </tr>
          ))}
          {SCORE_ROWS.map((k) => {
            const best = Math.max(...selected.map((p) => p.scores?.[k] ?? 0));
            return (
              <tr key={k}>
                <td className="cap">{k} score</td>
                {selected.map((p) => (
                  <td key={p._id} className={p.scores?.[k] === best ? "best" : ""}>{p.scores?.[k] ?? "-"} / 10</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="muted">Green = best value in that row.</p>
    </div>
  );
}
