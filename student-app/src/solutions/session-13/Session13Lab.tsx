import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./features/auth/AuthContext";
import { AppLayout } from "./layouts/AppLayout";
import { ToolListPage } from "./features/tools/ToolListPage";
import { ToolDetailPage } from "./features/tools/ToolDetailPage";
import { AddToolPage } from "./features/tools/AddToolPage";
import { LoginPage } from "./features/auth/LoginPage";
import { RequireAuth } from "./features/auth/RequireAuth";

const queryClient = new QueryClient();

// Task 1 + Task 5 (module-13 lab.md): ThemeProvider/CssBaseline, with the
// palette nudged to match the existing .active / .deprecated badge colours
// in ToolCard.module.css, so MUI and CSS Modules don't look like two apps
// stitched together.
const theme = createTheme({
  palette: {
    primary: { main: "#0f172a" },
    success: { main: "#15803d" }, // matches .active badge
    error: { main: "#b91c1c" },   // matches .deprecated badge
  },
  shape: { borderRadius: 6 },
});

export function Session13Lab() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route element={<AppLayout />}>
                <Route index element={<ToolListPage />} />
                <Route path="tools/:id" element={<ToolDetailPage />} />
                <Route path="tools/add" element={<AddToolPage />} />
              </Route>

              <Route element={<RequireAuth />}>
                <Route element={<AppLayout />}>
                  <Route path="settings" element={<div><h1>Settings</h1></div>} />
                </Route>
              </Route>

              <Route path="*" element={<div><h1>404</h1></div>} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
