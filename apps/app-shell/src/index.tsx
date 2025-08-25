import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import "./styles.css";

// Carga perezosa del MF de registro
const RegistroLazy = React.lazy(() => import("../../registro/src/App"));

// Pequeño ErrorBoundary para capturar fallos de carga del remoto
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
        <div className="p-6 border rounded bg-red-50 text-red-700">
          No se pudo cargar el módulo de registro. ¿Está ejecutándose el remoto en <code>localhost:3001</code>?
        </div>
      );
    }
    return this.props.children;
  }
}

function Nav() {
  const location = useLocation();
  const Item = ({
    to,
    label,
    disabled
  }: {
    to?: string;
    label: string;
    disabled?: boolean;
  }) => {
    if (disabled) {
      return (
        <span
          className="px-3 py-1 rounded border cursor-not-allowed opacity-50"
          title="Próximamente"
          aria-disabled="true"
        >
          {label}
        </span>
      );
    }
    return (
      <Link
        to={to!}
        className={`px-3 py-1 rounded border hover:bg-gray-100 ${
          location.pathname === to ? "bg-gray-100" : ""
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="flex gap-2 flex-wrap">
      <Item label="Inicio" to="/" />
      <Item label="Agenda" disabled />
      <Item label="Sesiones" disabled />
      <Item label="Ponentes" disabled />
      <Item label="Patrocinadores" disabled />
      <Item label="Registro" to="/registro" />
    </nav>
  );
}

function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Plataforma de Eventos</h1>
      <p className="text-sm opacity-80">
        Esta es la plantilla inicial. Solo el módulo <strong>Registro</strong> está activo; el resto
        aparecen como “Próximamente”.
      </p>
      <ul className="list-disc ml-6">
        <li>Agenda – próximamente</li>
        <li>Sesiones – próximamente</li>
        <li>Ponentes – próximamente</li>
        <li>Patrocinadores – próximamente</li>
        <li>Registro – <em>habilitado</em></li>
      </ul>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/registro"
            element={
              <ErrorBoundary>
                <React.Suspense fallback={<div className="p-6">Cargando módulo de registro…</div>}>
                  <RegistroLazy />
                </React.Suspense>
              </ErrorBoundary>
            }
          />
          <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const el = document.getElementById("root");
if (el) createRoot(el).render(<App />);
