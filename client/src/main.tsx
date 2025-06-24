import { createRoot } from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

// Suppress cross-origin errors globally
window.addEventListener('error', (event) => {
  if (event.message === 'Script error.' || event.message.includes('cross-origin')) {
    event.preventDefault();
    return false;
  }
});

// Suppress unhandled promise rejections from cross-origin sources
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && typeof event.reason === 'string' && event.reason.includes('cross-origin')) {
    event.preventDefault();
    return false;
  }
});

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
