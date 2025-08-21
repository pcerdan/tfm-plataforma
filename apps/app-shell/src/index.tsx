import { createRoot } from "react-dom/client";

// DEBUG: comprueba que este log sale en la consola del navegador
console.log("[app-shell] index.tsx ejecutado");

const el = document.getElementById("root");
if (!el) {
  // Si esto aparece, el problema es el HTML (no existe #root)
  alert("No se encontró el div#root");
} else {
  createRoot(el).render(
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>Plantilla App Shell ✅</h1>
    </div>
  );
}
