import React from "react";
import ReactDOM from "react-dom/client";
import "./tailwind.css";
import "./index.css";
import App from "./App";
// Auth0 removed - using Firebase Auth

// Import quick seed for development
import "./utils/quickSeed";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
