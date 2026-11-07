import { Link } from "react-router-dom";

const NotFound = () => (
  <main style={{ minHeight: "100vh", display: "grid", placeContent: "center", gap: 12, textAlign: "center", background: "#101112", color: "#f4f4f2", padding: 24 }}>
    <h1 style={{ margin: 0, color: "#fbcc13", fontSize: "3rem" }}>404</h1>
    <p style={{ margin: 0 }}>We couldn’t find that page.</p>
    <Link to="/" style={{ color: "#fbcc13" }}>Back to SplitMate</Link>
  </main>
);

export default NotFound;
