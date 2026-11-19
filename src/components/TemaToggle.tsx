"use client";

import { useEffect } from "react";
import { CLAVE_TEMA } from "@/lib/config";
import { alternarTema, aplicarTema } from "@/lib/tema";

export function TemaToggle() {
  useEffect(() => {
    const sincronizar = (evento: StorageEvent) => {
      if (evento.key === CLAVE_TEMA || evento.key === null) aplicarTema(evento.newValue);
    };
    window.addEventListener("storage", sincronizar);
    return () => window.removeEventListener("storage", sincronizar);
  }, []);

  return (
    <button
      type="button"
      onClick={alternarTema}
      className="grid size-8 place-items-center rounded-md text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
    >
      <span className="dark:hidden">
        <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20.5 14.1A8.5 8.5 0 1 1 9.9 3.5a6.8 6.8 0 0 0 10.6 10.6Z" />
        </svg>
        <span className="sr-only">Cambiar a tema oscuro</span>
      </span>
      <span className="hidden dark:inline">
        <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
        </svg>
        <span className="sr-only">Cambiar a tema claro</span>
      </span>
    </button>
  );
}
