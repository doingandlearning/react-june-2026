import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { ToolListPage } from "./pages/ToolListPage";
import { ToolDetailPage } from "./pages/ToolDetailPage";
import { SettingsPage } from "./pages/SettingsPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RequireAuth } from "./components/RequireAuth";

// TODO Task 6 — fill in the route config
// Structure:
//   /login              → LoginPage (public, no layout)
//   / (index)           → ToolListPage  } inside AppLayout
//   /tools/:id          → ToolDetailPage }
//   /settings           → SettingsPage  } inside RequireAuth + AppLayout
//   * (catch-all)       → NotFoundPage (no layout)

export function Session06Lab() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* TODO — nest ToolListPage and ToolDetailPage inside AppLayout */}

        {/* TODO — nest SettingsPage inside RequireAuth, then inside AppLayout */}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
