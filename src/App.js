// src/App.js
import React from "react";
import Index from "./pages/Index";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Css
import "./assets/vendor/switcher/switcher.css";
import "./assets/vendor/swiper/swiper-bundle.min.css";
import "./assets/css/style.css";

// Create a single QueryClient instance for the whole app
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Index />
    </QueryClientProvider>
  );
}

export default App;
