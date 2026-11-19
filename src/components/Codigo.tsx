"use client";

import { useState } from "react";

export function Codigo({ codigo, titulo }: { codigo: string; titulo?: string }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    await navigator.clipboard.writeText(codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  };

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 dark:bg-neutral-900">
      <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-2">
        <span className="font-mono text-xs text-neutral-400">{titulo ?? "shell"}</span>
        <button type="button" onClick={copiar} className="rounded px-2 py-0.5 text-xs text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100">
          {copiado ? "Copiado" : "Copiar"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6 text-neutral-100">
        <code>{codigo}</code>
      </pre>
    </div>
  );
}
