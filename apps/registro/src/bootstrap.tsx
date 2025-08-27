import React from "react";
import { createRoot } from "react-dom/client";
import RegistroApp from "./App";

const el = document.getElementById("root");
if (el) {
  createRoot(el).render(
    <RegistroApp
      theme={{ primaryColor: "#4f46e5" }}
      config={{
        showSessionSelector: true,
        extraFields: [
          { name: "empresa", label: "Empresa", type: "text", required: false },
          { name: "telefono", label: "Teléfono", type: "tel", required: false }
        ]
      }}
    />
  );
}
