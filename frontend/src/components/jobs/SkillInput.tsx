"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/Button";

export function SkillInput({ value, onChange, label, id }: { value: string[]; onChange: (skills: string[]) => void; label: string; id: string }) {
  const [draft, setDraft] = useState("");
  function addSkill() {
    const skill = draft.trim();
    if (skill && !value.includes(skill)) onChange([...value, skill]);
    setDraft("");
  }
  return <div>
    <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor={id}>{label}</label>
    <div className="flex gap-2"><input id={id} className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addSkill(); } }} placeholder="Add a skill" /><Button type="button" variant="secondary" onClick={addSkill}>Add</Button></div>
    {value.length > 0 && <ul className="mt-3 flex flex-wrap gap-2" aria-label={`${label} selected`}>
      {value.map((skill) => <li className="flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800" key={skill}>{skill}<button type="button" className="text-teal-600 hover:text-teal-950" aria-label={`Remove ${skill}`} onClick={() => onChange(value.filter((item) => item !== skill))}>×</button></li>)}
    </ul>}
  </div>;
}