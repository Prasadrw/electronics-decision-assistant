import { useState } from "react";
import { api } from "../api.js";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api(`/auth/${mode}`, { method: "POST", body: form });
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card auth-card" onSubmit={submit}>
        <h2>{mode === "login" ? "Login" : "Create account"}</h2>
        {mode === "register" && (
          <input name="name" placeholder="Name" value={form.name} onChange={change} required />
        )}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
        <input name="password" type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={change} required />
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={loading}>{loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}</button>
        <p className="muted center">
          {mode === "login" ? "New here? " : "Already have an account? "}
          <a href="#" onClick={(e) => { e.preventDefault(); setMode(mode === "login" ? "register" : "login"); setError(""); }}>
            {mode === "login" ? "Register" : "Login"}
          </a>
        </p>
      </form>
    </div>
  );
}
