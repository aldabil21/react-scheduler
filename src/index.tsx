import * as React from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={createTheme()}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
