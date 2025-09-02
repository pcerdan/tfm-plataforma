import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import "./styles.css";
import "./navbar";
import { StickyNavbar } from "./navbar";
import { RegistroConfigProvider, useRegistroConfig } from "./RegistroConfigContext";
import ConfigRegistro from "./ConfigRegistro";
import type { RegistroConfig } from "./types/registro";
import ("../../registro/src/styles.css");

/*function loadRemoteStyles(url: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    // evita recargar si ya está inyectado
    if (document.querySelector(`link[href="${url}"]`)) {
      resolve();
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.onload = () => resolve();
    link.onerror = () => reject(`No se pudo cargar ${url}`);
    document.head.appendChild(link);
  });
}*/


// Carga del MF de registro
const RegistroLazy = React.lazy(() =>
  import("registro/RegistroApp").then((mod) => ({ default: mod.default }))
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
    <div className="space-y-4 bg-white rounded-xl p-6 shadow">
      <h1 className="text-2xl font-semibold text-center">Plataforma de Eventos</h1>
      <p className="text-sm text-gray-600 text-center">
        Esta es la plantilla inicial. Solo el módulo <strong>Registro</strong> está activo; el resto
        aparecen como “Próximamente”.
      </p>
      <ul className="list-disc ml-6 text-sm text-gray-700">
        <li>Agenda – próximamente</li>
        <li>Sesiones – próximamente</li>
        <li>Ponentes – próximamente</li>
        <li>Patrocinadores – próximamente</li>
        <li>Registro – <em>habilitado</em></li>
      </ul>
      <div className="bg-red-500 text-white p-4">¿Tailwind está funcionando?</div>
    </div>
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
              <Route path="*" element={<div className="text-center text-gray-600">Página no encontrada</div>} />
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
