import { useNavigate } from "react-router-dom";
import { useRegistroConfig } from "./RegistroConfigContext";
import { useState } from "react";
import type { RegistroConfig, ExtraField } from "./types/registro"; // Ajusta ruta si está en otro sitio

export default function ConfiguradorRegistro() {
  const { setConfig } = useRegistroConfig();
  const navigate = useNavigate();

  const [color, setColor] = useState("#1d4ed8");
  const [showSessionSelector, setShowSessionSelector] = useState(true);

  const [extraFields, setExtraFields] = useState<ExtraField[]>([
    { name: "empresa", label: "Empresa", type: "text", required: false },
    { name: "telefono", label: "Teléfono", type: "tel", required: false }
  ]);

  const handleSubmit = () => {
    const config: RegistroConfig = {
      theme: {
        primaryColor: color
      },
      config: {
        showSessionSelector,
        extraFields
      }
    };

    setConfig(config);
    navigate("/registro");
  };

  return (
    <div className="space-y-4 p-6 bg-white rounded shadow max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">Configurar módulo de registro</h2>

      <div>
        <label className="block font-medium">Color principal:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="mt-1"
        />
      </div>

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

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900"
      >
        Continuar
      </button>
    </div>
  );
}
