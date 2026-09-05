import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type LabelProps = { label: string; htmlFor: string; hint?: string; required?: boolean };

export function FieldLabel({ label, htmlFor, hint, required }: LabelProps) {
  return <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor={htmlFor}>
    {label}{required && <span className="ml-1 text-rose-600">*</span>}
    {hint && <span className="ml-2 font-normal text-slate-400">{hint}</span>}
  </label>;
}

const fieldClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${fieldClass} ${props.className ?? ""}`} {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${fieldClass} min-h-28 resize-y ${props.className ?? ""}`} {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${fieldClass} ${props.className ?? ""}`} {...props} />;
}