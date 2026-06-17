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

export function Session11Lab() {
  return (
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
  );
}
