import { Link as RouterLink, Outlet, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";

const CONTENT_WIDTH = 540;

export function RootLayout() {
  const { pathname } = useLocation();

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar
          component="nav"
          aria-label="Main"
          sx={{ maxWidth: CONTENT_WIDTH, mx: "auto", width: "100%" }}
        >
          <Button
            component={RouterLink}
            to="/"
            variant={pathname === "/" ? "outlined" : "text"}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            Feedback
          </Button>
          <Button
            component={RouterLink}
            to="/history"
            variant={pathname.startsWith("/history") ? "outlined" : "text"}
            aria-current={pathname.startsWith("/history") ? "page" : undefined}
          >
            History
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ maxWidth: CONTENT_WIDTH, mx: "auto", p: 4 }}>
        <Outlet />
      </Box>
    </>
  );
}
