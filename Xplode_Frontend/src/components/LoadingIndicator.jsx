import "./loading-indicator.css";

export default function LoadingIndicator({ label = "Loading", small = false }) {
  return <span className={`loading-indicator${small ? " loading-indicator--small" : ""}`} role="status" aria-label={label}>
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle className="loading-indicator-track" cx="32" cy="32" r="28" />
      <circle className="loading-indicator-arc" cx="32" cy="32" r="28" />
      <image className="loading-indicator-logo" href="/New%20Assets/LOGO%20Download.svg" x="19" y="24" width="26" height="16" />
    </svg>
  </span>;
}
