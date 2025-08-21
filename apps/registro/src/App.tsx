import React, { useState } from "react";
import "./styles.css";

type Inscripcion = { nombre: string; email: string; sesiones: string[] };

export default function RegistroApp() {
  const [form, setForm] = useState<Inscripcion>({ nombre: "", email: "", sesiones: [] });
  const [ok, setOk] = useState(false);

  const toggleSesion = (s: string) =>
    setForm(f => ({
      ...f,
      sesiones: f.sesiones.includes(s) ? f.sesiones.filter(x => x !== s) : [...f.sesiones, s]
    }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return alert("Revisa los campos");
    const registros = JSON.parse(localStorage.getItem("registros") || "[]");
    registros.push({ ...form, fecha: new Date().toISOString() });
    localStorage.setItem("registros", JSON.stringify(registros));
    setOk(true);
  };

  if (ok) return <div className="p-6 text-center">✅ Registro completado. ¡Gracias!</div>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Registro de asistentes</h1>
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full border p-2 rounded" placeholder="Nombre"
          value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}/>
        <input className="w-full border p-2 rounded" placeholder="Email"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/>
        <fieldset className="border p-3 rounded">
          <legend className="px-1">Sesiones</legend>
          {["Taller 1","Taller 2","Keynote"].map(s => (
            <label key={s} className="block">
              <input type="checkbox" checked={form.sesiones.includes(s)} onChange={() => toggleSesion(s)} /> {s}
            </label>
          ))}
        </fieldset>
        <button className="bg-black text-white px-4 py-2 rounded">Enviar</button>
      </form>
    </div>
  );
}
