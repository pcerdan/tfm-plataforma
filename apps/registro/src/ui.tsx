import React from "react";
import { clsx } from "clsx";

type SessionCardProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
  onBlur?: () => void;
  color: "indigo" | "emerald" | "amber";
};

const colorClasses = {
  indigo: {
    base: "bg-indigo-100",
    hover: "hover:bg-indigo-200",
    selected: "bg-indigo-300"
  },
  emerald: {
    base: "bg-emerald-100",
    hover: "hover:bg-emerald-200",
    selected: "bg-emerald-300"
  },
  amber: {
    base: "bg-amber-100",
    hover: "hover:bg-amber-200",
    selected: "bg-amber-300"
  }
};


export function Label({ htmlFor, children }: React.PropsWithChildren<{ htmlFor: string }>) {
  return <label htmlFor={htmlFor} className="block text-sm mb-1 font-medium text-center">{children}</label>;
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input(props, ref) {
  const { className, ...rest } = props;
  const base = "w-72 mx-auto border rounded px-3 py-2 outline-none transition";
  const ring = "focus:ring-2 focus:ring-black/50 focus:border-black";
  return (
    <input
      ref={ref}
      {...rest}
      className={`${base} ${ring} border-gray-300 ${className || ""}`}
    />
  );
});

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function Button(props, ref) {
  const { className, disabled, ...rest } = props;
  const base = "inline-flex items-center justify-center rounded px-4 py-2 transition";
  const enabled = "bg-black text-white hover:bg-black/90";
  const disabledCls = "bg-gray-200 text-gray-500 cursor-not-allowed";
  return (
    <button
      ref={ref}
      {...rest}
      className={`${base} ${disabled ? disabledCls : enabled} ${className || ""}`}
    />
  );
});

export function Help({ children }: React.PropsWithChildren<{}>) {
  return <p className="text-xs text-gray-500 mt-1">{children}</p>;
}

export function FieldError(
  { children, id }: React.PropsWithChildren<{ id?: string }>
) {
  return <p id={id} role="alert" className="text-xs text-red-600 mt-1">{children}</p>;
}


export function SessionCard({
  label,
  checked,
  onChange,
  onBlur,
  color,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  onBlur?: () => void;
  color: "indigo" | "emerald" | "amber";
}) {
  const baseClasses = "rounded-lg text-sm text-gray-900 transition-colors text-center border w-44 h-24 flex items-center justify-center cursor-pointer select-none";

  const colorClass = clsx({
    "bg-indigo-100 hover:bg-indigo-200": color === "indigo" && !checked,
    "bg-emerald-100 hover:bg-emerald-200": color === "emerald" && !checked,
    "bg-amber-100 hover:bg-amber-200": color === "amber" && !checked,
    "bg-indigo-300": color === "indigo" && checked,
    "bg-emerald-300": color === "emerald" && checked,
    "bg-amber-300": color === "amber" && checked,
  });

  return (
    <label className={clsx(baseClasses, colorClass, "m-2")}>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
        onBlur={onBlur}
        aria-checked={checked}
      />
      <div className="font-semibold">{label}</div>
    </label>
  );
}