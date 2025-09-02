import React, { useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";
import { Button, FieldError, Help, Input, Label, SessionCard } from "./ui";
// 🧩 Tipado de configuración recibida por props
type RegistroTheme = {
  primaryColor: string;
};

type ExtraField = {
  name: string;
  label: string;
  type: string;
  required: boolean;
};

type RegistroConfig = {
  theme: {
    primaryColor: string;
  };
  config: {
    showSessionSelector: boolean;
    extraFields: {
        name: string;
        label: string;
        type: string;
        required: boolean;
    }[];
  };
};

// Datos internos
type Inscripcion = {
  id: string;
  nombre: string;
  email: string;
  sesiones: string[];
  fecha: string;
};

const SESIONES = ["Seminario sobre IA", "Taller de Programación Competitiva", "Iniciación a la Programación"] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const colorMap: Record<(typeof SESIONES)[number], "indigo" | "emerald" | "amber"> = {
  "Seminario sobre IA": "indigo",
  "Taller de Programación Competitiva": "emerald",
  "Iniciación a la Programación": "amber"
};

const read = (): Inscripcion[] => {
  try {
    return JSON.parse(localStorage.getItem("registros") || "[]");
  } catch {
    return [];
  }
};
const write = (r: Inscripcion) =>
  localStorage.setItem("registros", JSON.stringify([...read(), r]));

type Props = RegistroConfig;
export default function RegistroApp({ config, theme }: Props) {
  const color = theme?.primaryColor || "#1d4ed8";
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [sesiones, setSesiones] = useState<string[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);
  const firstInvalidRef = useRef<HTMLInputElement | null>(null);
  const [extraFields, setExtraFields] = useState<Record<string, string>>({});

  const errors = useMemo(() => ({
    nombre: nombre.trim() ? null : "El nombre es obligatorio.",
    email: email.trim() ? (EMAIL_RE.test(email) ? null : "Introduce un email válido.") : "El email es obligatorio.",
    sesiones: !config?.showSessionSelector || sesiones.length ? null : "Selecciona al menos una sesión.",
  }), [nombre, email, sesiones, config]);

  const hasErrors = Object.values(errors).some(Boolean);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ nombre: true, email: true, sesiones: true });

    if (hasErrors) {
      firstInvalidRef.current?.focus();
      return;
    }

    const reg: Inscripcion = {
      id: crypto.randomUUID(),
      nombre: nombre.trim(),
      email: email.trim(),
      sesiones: [...sesiones],
      fecha: new Date().toISOString()
    };

    write(reg);
    setToast("Registro completado.");
    setNombre("");
    setEmail("");
    setSesiones([]);
    setTouched({});
    setExtraFields({});
  };

  const setFirstInvalid = (el: HTMLInputElement | null, invalid: boolean) => {
    if (invalid && !firstInvalidRef.current) firstInvalidRef.current = el;
  };

  if (!config) {
    return <p>Condig. no disponible</p>
  }

  return (
    <section className="min-h-dvh flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold mb-1 text-center text-[color:var(--primary)]">Registro de asistentes</h1>
        <p className="text-sm text-gray-600 text-center mb-6">Completa los campos marcados con *</p>

        <form
          onSubmit={onSubmit}
          className="space-y-5 mt-4"
          noValidate
          aria-describedby="form-status"
          style={{ "--primary": color } as React.CSSProperties}
        >
          {/* Nombre */}
          <div className="text-center">
            <Label htmlFor="nombre">Nombre <span className="text-red-600">*</span></Label>
            <Input
              id="nombre"
              placeholder="Tu nombre"
              value={nombre}
              onBlur={() => setTouched(t => ({ ...t, nombre: true }))}
              onChange={(e) => setNombre(e.target.value)}
              ref={(el) => setFirstInvalid(el, !!(touched.nombre && errors.nombre))}
              aria-invalid={!!(touched.nombre && errors.nombre)}
              aria-describedby={touched.nombre && errors.nombre ? "err-nombre" : undefined}
            />
            {touched.nombre && errors.nombre
              ? <FieldError id="err-nombre">{errors.nombre}</FieldError>
              : <Help>Como aparece en tu acreditación.</Help>}
          </div>

          {/* Email */}
          <div className="text-center">
            <Label htmlFor="email">Email <span className="text-red-600">*</span></Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              value={email}
              onBlur={() => setTouched(t => ({ ...t, email: true }))}
              onChange={(e) => setEmail(e.target.value)}
              ref={(el) => setFirstInvalid(el, !!(touched.email && errors.email))}
              aria-invalid={!!(touched.email && errors.email)}
              aria-describedby={touched.email && errors.email ? "err-email" : undefined}
            />
            {touched.email && errors.email
              ? <FieldError id="err-email">{errors.email}</FieldError>
              : <Help>Usaremos este email para confirmar tu plaza.</Help>}
          </div>

          {/* Campos extra */}
          {config?.extraFields?.map((field : ExtraField) => (
            <div className="text-center" key={field.name}>
              <Label htmlFor={field.name}>
                {field.label} {field.required && <span className="text-red-600">*</span>}
              </Label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                required={field.required}
                value={extraFields[field.name] || ""}
                onChange={(e) => setExtraFields(f => ({ ...f, [field.name]: e.target.value }))}
              />
            </div>
          ))}

          {/* Sesiones (si se habilita) */}
          {config?.showSessionSelector && (
            <fieldset
              className={`rounded-2xl px-4 py-4 border ${touched.sesiones && errors.sesiones ? "border-red-500" : "border-gray-300"}`}
            >
              <legend className="px-1 text-sm font-medium text-center">Lista de conferencias <span className="text-red-600">*</span></legend>
              <div className="flex flex-wrap justify-center items-center gap-4">
                {SESIONES.map((s) => (
                  <SessionCard
                    key={s}
                    label={s}
                    checked={sesiones.includes(s)}
                    color={colorMap[s]}
                    onChange={() =>
                      setSesiones((prev) =>
                        prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                      )
                    }
                    onBlur={() => setTouched((t) => ({ ...t, sesiones: true }))}
                  />
                ))}
              </div>

              {touched.sesiones && errors.sesiones
                ? <p className="text-red-600 text-xs mt-2 text-center">{errors.sesiones}</p>
                : <p className="text-xs text-gray-500 mt-2 text-center">Selecciona una o más a las que asistir.</p>}
            </fieldset>
          )}

          {/* Botones */}
          <div className="flex justify-center gap-4 mt-6">
            <Button type="submit" disabled={hasErrors && Object.keys(touched).length > 0}>
              Enviar
            </Button>
            <button
              type="button"
              className="border px-4 py-2 rounded text-sm"
              onClick={() => {
                setNombre("");
                setEmail("");
                setSesiones([]);
                setTouched({});
                setExtraFields({});
              }}
            >
              Limpiar
            </button>
          </div>

          <div id="form-status" className="sr-only" aria-live="polite">
            {toast ? "Registro completado" : ""}
          </div>
        </form>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white rounded px-4 py-2 shadow">
            {toast}
          </div>
        )}
      </div>
    </section>
  );
}
