import { createTheme } from "@mui/material/styles";

// MUI's default primary blue (#1976d2) sits at ~4.6:1 contrast against
// white — enough to clear WCAG AA (4.5:1) but short of AAA (7:1) for
// normal text. It's the most common contrast complaint against the
// out-of-the-box MUI palette. #0B3D91 lands at ~10:1 against white,
// clearing AAA with room to spare, while still reading as blue.
//
// The default text.secondary (black at 60% opacity, ~4.6:1 on white) has
// the same problem — used here for the history-entry timestamp — so it's
// darkened to 75% opacity (~10:1).
export const theme = createTheme({
  palette: {
    primary: {
      main: "#0B3D91",
    },
    text: {
      secondary: "rgba(0, 0, 0, 0.75)",
    },
  },
});
