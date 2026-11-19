import type { ReactNode } from "react";

const ESTILOS = {
  nota: "border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-400/25 dark:bg-sky-400/10 dark:text-sky-100",
  importante: "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-100",
};

export function Aviso({ tipo = "nota", titulo, children }: { tipo?: keyof typeof ESTILOS; titulo?: string; children: ReactNode }) {
  return (
    <div className={`mt-6 rounded-lg border px-4 py-3 text-sm leading-6 ${ESTILOS[tipo]}`}>
      {titulo && <p className="!mt-0 font-semibold">{titulo}</p>}
      <div className={titulo ? "mt-1" : undefined}>{children}</div>
    </div>
  );
}
