import { Link as RouterLink, Outlet } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";

const CONTENT_WIDTH = 540;

export function RootLayout() {
  return (
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ maxWidth: CONTENT_WIDTH, mx: "auto", width: "100%" }}>
          <Button component={RouterLink} to="/">
            Feedback
          </Button>
          <Button component={RouterLink} to="/history">
            History
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: CONTENT_WIDTH, mx: "auto", p: 4 }}>
        <Outlet />
      </Box>
    </>
  );
}
