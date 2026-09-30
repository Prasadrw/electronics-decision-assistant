import { useState } from "react";
import Auth from "./components/Auth.jsx";
import Products from "./components/Products.jsx";
import Recommend from "./components/Recommend.jsx";
import Compare from "./components/Compare.jsx";
import AddProduct from "./components/AddProduct.jsx";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [tab, setTab] = useState("products");
  const [selected, setSelected] = useState([]); // products chosen for comparison

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setSelected([]);
  };

  const toggleSelect = (product) => {
    setSelected((prev) => {
      if (prev.find((p) => p._id === product._id)) return prev.filter((p) => p._id !== product._id);
      if (prev.length >= 3) {
        alert("You can compare up to 3 products");
        return prev;
      }
      return [...prev, product];
    });
  };

  if (!token) return <Auth onLogin={login} />;

  const tabs = [
    ["products", "Products"],
    ["recommend", "Recommend"],
    ["compare", `Compare (${selected.length})`],
    ["add", "Add Product"],
  ];

  return (
    <div className="container">
      <header className="header">
        <h1>Electronics Decision Assistant</h1>
        <div>
          <span className="muted">Hi, {user?.name}</span>{" "}
          <button className="btn secondary" onClick={logout}>Logout</button>
        </div>
      </header>

      <nav className="tabs">
        {tabs.map(([key, label]) => (
          <button key={key} className={tab === key ? "tab active" : "tab"} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </nav>

      {tab === "products" && <Products token={token} user={user} selected={selected} onToggle={toggleSelect} />}
      {tab === "recommend" && <Recommend selected={selected} onToggle={toggleSelect} />}
      {tab === "compare" && <Compare selected={selected} onToggle={toggleSelect} />}
      {tab === "add" && <AddProduct token={token} onDone={() => setTab("products")} />}
    </div>
  );
}
