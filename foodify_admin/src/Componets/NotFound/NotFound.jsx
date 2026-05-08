import "./notfound.css";

export default function NotFound() {
  return (
    <div className="nf-container">
      <h1 className="nf-title">404</h1>
      <p className="nf-text">Oops! The page you're looking for doesn’t exist.</p>

      <button className="nf-btn" onClick={() => window.location.href = "/"}>
        Go Back Dashboard
      </button>
    </div>
  );
}
