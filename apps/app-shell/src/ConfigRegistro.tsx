import { useNavigate } from "react-router-dom";
import { useRegistroConfig } from "./RegistroConfigContext";
import { useState } from "react";
import type { RegistroConfig, ExtraField } from "./types/registro";

export default function ConfiguradorRegistro() {
  const { setConfig } = useRegistroConfig();
  const navigate = useNavigate();
  const [showSessionSelector, setShowSessionSelector] = useState(true);
  const [showTelfSelector, setShowTelfSelector] = useState(false);
  const [showEmpresaSelector, setShowEmpresaSelector] = useState(false);
  const [toast, setToast] = useState<string | null>(null);


  const [extraFields, setExtraFields] = useState<ExtraField[]>([
    { name: "empresa", label: "Empresa", type: "text", required: false },
    { name: "telefono", label: "Teléfono", type: "tel", required: false }
  ]);

  const handleSubmit = () => {
  const config: RegistroConfig = {
      config: {
        showSessionSelector,
        extraFields: [
          ...(showEmpresaSelector
            ? [{ name: "empresa", label: "Empresa", type: "text", required: false }]
            : []),
          ...(showTelfSelector
            ? [{ name: "telefono", label: "Teléfono", type: "tel", required: false }]
            : [])
        ]
      }
    };

    // Guarda en contexto
    setConfig(config);

    // Guarda en localStorage ⬇️
    localStorage.setItem("registro-config", JSON.stringify(config));

    setToast("Configuración guardada correctamente");
  };


  return (
    <div className="space-y-4 p-6 bg-white rounded shadow max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">Configurar módulo de registro</h2>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showSessionSelector}
            onChange={(e) => setShowSessionSelector(e.target.checked)}
          />
          Mostrar selector de sesiones
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showTelfSelector}
            onChange={(e) => setShowTelfSelector(e.target.checked)}
          />
          Solicitar Número de Teléfono
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showEmpresaSelector}
            onChange={(e) => setShowEmpresaSelector(e.target.checked)}
          />
          Solicitar Empresa
        </label>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 cursor-pointer"
      >
        Guardar configuración
      </button>

      {toast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </div>
  );
}
