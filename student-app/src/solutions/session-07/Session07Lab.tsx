import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { ToolListPage } from "./pages/ToolListPage";
import { ToolDetailPage } from "./pages/ToolDetailPage";
import { AddToolPage } from "./pages/AddToolPage";
import { SettingsPage } from "./pages/SettingsPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RequireAuth } from "./components/RequireAuth";

// Route config carried forward from Session 06 — /tools/add is new.
// Add a "+" link in ToolListPage to navigate to /tools/add.

export function Session07Lab() {
  return (
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
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
