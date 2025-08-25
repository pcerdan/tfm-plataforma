import React, { useMemo, useState } from "react";
import "./styles.css";

type Inscripcion = {
  id: string;
  nombre: string;
  email: string;
  sesiones: string[];
  fecha: string; // ISO
};

const SESIONES_DISPONIBLES = ["Taller 1", "Taller 2", "Conferencia 1"] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function leerRegistros(): Inscripcion[] {
  try {
    return JSON.parse(localStorage.getItem("registros") || "[]");
  } catch {
    return [];
  }
}
function guardarRegistro(r: Inscripcion) {
  const arr = leerRegistros();
  arr.push(r);
  localStorage.setItem("registros", JSON.stringify(arr));
}

export default function RegistroApp() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [sesiones, setSesiones] = useState<string[]>([]);
  const [enviado, setEnviado] = useState<Inscripcion | null>(null);
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});

  const errores = useMemo(() => {
    const e: { [k: string]: string | null } = {};
    e.nombre = nombre.trim() ? null : "El nombre es obligatorio.";
    e.email = email.trim() ? (EMAIL_RE.test(email) ? null : "Introduce un email válido.") : "El email es obligatorio.";
    e.sesiones = sesiones.length ? null : "Selecciona al menos una sesión.";
    return e;
  }, [nombre, email, sesiones]);

  const hayErrores = Object.values(errores).some((v) => v);

  const toggleSesion = (s: string) =>
    setSesiones((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const marcarTouched = (campo: string) =>
    setTouched((t) => (t[campo] ? t : { ...t, [campo]: true }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // marca todos como tocados al enviar
    setTouched({ nombre: true, email: true, sesiones: true });
    if (hayErrores) return;

    const reg: Inscripcion = {
      id: crypto.randomUUID(),
      nombre: nombre.trim(),
      email: email.trim(),
      sesiones: [...sesiones],
      fecha: new Date().toISOString(),
    };
    guardarRegistro(reg);
    setEnviado(reg);
  };

  if (enviado) {
    return (
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-3">✅ Registro completado</h1>
        <p className="mb-4">¡Gracias, {enviado.nombre}! Te hemos inscrito en:</p>
        <ul className="list-disc ml-5 mb-6">
          {enviado.sesiones.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="text-sm opacity-70 mb-6">Fecha: {new Date(enviado.fecha).toLocaleString()}</p>
        <button
          className="border px-4 py-2 rounded"
          onClick={() => {
            // permite nuevo registro sin recargar
            setEnviado(null);
            setNombre("");
            setEmail("");
            setSesiones([]);
            setTouched({});
          }}
        >
          Hacer otro registro
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Registro de asistentes</h1>

      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        {/* Nombre */}
        <div>
          <label className="block text-sm mb-1" htmlFor="nombre">
            Nombre <span className="text-red-600">*</span>
          </label>
          <input
            id="nombre"
            className={`w-full border p-2 rounded outline-none ${
              touched.nombre && errores.nombre ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Tu nombre"
            value={nombre}
            onBlur={() => marcarTouched("nombre")}
            onChange={(e) => setNombre(e.target.value)}
          />
          {touched.nombre && errores.nombre && (
            <p className="text-red-600 text-xs mt-1">{errores.nombre}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1" htmlFor="email">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={`w-full border p-2 rounded outline-none ${
              touched.email && errores.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="tu@email.com"
            value={email}
            onBlur={() => marcarTouched("email")}
            onChange={(e) => setEmail(e.target.value)}
          />
          {touched.email && errores.email && (
            <p className="text-red-600 text-xs mt-1">{errores.email}</p>
          )}
        </div>

        {/* Sesiones */}
        <fieldset
          className={`border rounded p-3 ${
            touched.sesiones && errores.sesiones ? "border-red-500" : "border-gray-300"
          }`}
        >
          <legend className="px-1 text-sm">Sesiones <span className="text-red-600">*</span></legend>
          <div className="space-y-2 mt-2">
            {SESIONES_DISPONIBLES.map((s) => (
              <label key={s} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sesiones.includes(s)}
                  onChange={() => toggleSesion(s)}
                  onBlur={() => marcarTouched("sesiones")}
                />
                <span>{s}</span>
              </label>
            ))}
          </div>
          {touched.sesiones && errores.sesiones && (
            <p className="text-red-600 text-xs mt-2">{errores.sesiones}</p>
          )}
        </fieldset>

        {/* Acciones */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={hayErrores && Object.keys(touched).length > 0}
          >
            Enviar
          </button>
          <button
            type="button"
            className="border px-4 py-2 rounded"
            onClick={() => {
              setNombre("");
              setEmail("");
              setSesiones([]);
              setTouched({});
            }}
          >
            Limpiar
          </button>
        </div>
      </form>

      {/* Debug opcional: ver registros guardados */}
      {/* <pre className="mt-6 text-xs opacity-70">{JSON.stringify(leerRegistros(), null, 2)}</pre> */}
    </div>
  );
}
