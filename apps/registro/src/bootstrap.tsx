import React from "react";
import { createRoot } from "react-dom/client";
import RegistroApp from "./App";

const el = document.getElementById("root");
if (el) createRoot(el).render(<RegistroApp />);
