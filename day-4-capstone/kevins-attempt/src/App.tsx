import { BrowserRouter, Route, Routes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { RootLayout } from "./components/RootLayout";
import { FeedbackProvider } from "./context/FeedbackContext";
import { HistoryDetailPage } from "./pages/HistoryDetailPage";
import { HistoryPage } from "./pages/HistoryPage";
import { HomePage } from "./pages/HomePage";
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FeedbackProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/history/:id" element={<HistoryDetailPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FeedbackProvider>
    </ThemeProvider>
  );
}

export default App;
