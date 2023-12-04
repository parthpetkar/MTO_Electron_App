import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
const root = document.getElementById("root");

// Create a root using createRoot
const reactRoot = createRoot(root);

// Render your component inside the root
reactRoot.render(<App/>);
