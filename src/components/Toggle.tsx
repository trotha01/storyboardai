import React from 'react';

interface Props {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export default function Toggle({ id, label, checked, onChange }: Props) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
      <input
        id={id}
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className="w-10 h-6 rounded-full bg-[var(--stroke)] peer-checked:bg-[var(--accent)] relative transition-colors"
        aria-hidden="true"
      >
        <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform peer-checked:translate-x-4"></span>
      </span>
      <span className="text-[var(--muted-ink)] text-[var(--fs-0)]">{label}</span>
    </label>
  );
}
