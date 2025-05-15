import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PredictionResult from "./pages/PredictionResultPage.tsx";
import { ThemeProvider } from "./context/ThemeContext";
import AdminLoginPage from "./pages/AdminLoginPage.tsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.tsx";
import { AuthProvider } from "./hooks/useAuth.tsx";
import RequireAdmin from "./components/RequireAdmin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import ModelManagerPage from "./pages/ModelManagerPage.tsx";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/result" element={<PredictionResult />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin/dashboard"
                element={
                  <RequireAdmin>
                    <AdminDashboardPage />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/ModelManager"
                element={
                  <RequireAdmin>
                    <ModelManagerPage />
                  </RequireAdmin>
                }
              />

              <Toaster position="top-right" />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>

      {/* devtools (เลือกใส่) */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </React.StrictMode>
);
