import * as React from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={createTheme()}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
