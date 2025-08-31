import React from 'react';

interface Props {
  label: string;
  className?: string;
  children: React.ReactNode;
}

export default function Field({ label, className = '', children }: Props) {
  return (
    <label className={"flex flex-col gap-1 " + className}>
      <span className="text-[var(--muted-ink)] text-[var(--fs-0)]">{label}</span>
      {children}
    </label>
  );
}
