import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import "./styles.css";
import "./navbar";
import { StickyNavbar } from "./navbar";
import { RegistroConfigProvider, useRegistroConfig } from "./RegistroConfigContext";
import ConfigRegistro from "./ConfigRegistro";
import type { RegistroConfig } from "./types/registro";

function loadRemoteStyles(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`link[href="${url}"]`)) return resolve();
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    // Inserta ANTES del primer stylesheet de la shell → la shell manda
    const first = document.querySelector('link[rel="stylesheet"]');
    first?.parentNode?.insertBefore(link, first) ?? document.head.appendChild(link);
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`No se pudo cargar ${url}`));
  });
}

// CSS + módulo a la vez, devolviendo { default: Component }
const RegistroLazy = React.lazy(() =>
  Promise.all([
    import("registro/styles"),       // carga el CSS del remoto vía MF
    import("registro/RegistroApp"),  // y luego el componente
  ]).then(([, mod]) => ({ default: mod.default }))
);

// ErrorBoundary para capturar fallos de carga del remoto
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: any) {
    console.error("Error cargando microfrontend:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-100 text-red-800 border border-red-300 rounded p-4">
          <strong>Error:</strong> No se pudo cargar el módulo de registro. ¿Está ejecutándose el remoto en <code>localhost:3001</code>?
        </div>
      );
    }
    return this.props.children;
  }
}


function Home() {
  return (
    <section className="space-y-8 bg-white rounded-xl p-6 shadow mt-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ViuTech 2025</h1>
        <p className="text-lg text-gray-600">
          El evento online donde convergen las tendencias más disruptivas del desarrollo web.
        </p>
        <p className="text-sm text-gray-500 mt-1">Del 15 al 17 de septiembre · 100% gratuito</p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">¿Qué puedes esperar?</h2>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>🔧 Talleres prácticos sobre tecnologías modernas como React, Tailwind o TypeScript</li>
          <li>🎤 Charlas de expertos sobre diseño de interfaces, arquitectura y accesibilidad</li>
          <li>🚀 Una keynote especial sobre el futuro del desarrollo web</li>
          <li>💬 Networking con otros desarrolladores a través de la plataforma</li>
        </ul>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-700 mb-2">
          ¡No pierdas tu plaza! Elige las sesiones que más te interesen y únete al movimiento.
        </p>
        <a
          href="/registro"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded transition"
        >
          Registrarse ahora
        </a>
      </div>
    </section>
  );
}


function App() {
  const { config } = useRegistroConfig();

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
        <StickyNavbar />
        <main className="flex-grow overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <Routes>
              <Route path="/" element={<Home />} />
             <Route
                path="/registro"
                element={
                  <ErrorBoundary>
                    <React.Suspense fallback={<div className="p-6">Cargando módulo de registro…</div>}>
                      {config ? (
                        <RegistroLazy {...(config as RegistroConfig)} />
                      ) : (
                        <div className="p-6 text-red-600">No se ha configurado el registro. Ve a <Link to="/configuracion">Configuración</Link>.</div>
                      )}
                    </React.Suspense>
                  </ErrorBoundary>
                }
              />
              <Route path="/configuracion" element={<ConfigRegistro />} />
              <Route path="*" element={<div className="text-center text-gray-600">Disponible próximamente</div>} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

const el = document.getElementById("root");
if (el) 
  createRoot(el).render(
  <React.StrictMode>
    <RegistroConfigProvider>
      <App />
    </RegistroConfigProvider>
  </React.StrictMode>
  );
