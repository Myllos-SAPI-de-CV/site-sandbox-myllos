"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVEGACION } from "@/lib/config";

export function Navegacion({ horizontal = false }: { horizontal?: boolean }) {
  const ruta = usePathname();

  return (
    <nav aria-label="Secciones" className={horizontal ? "flex gap-1 overflow-x-auto" : "flex flex-col gap-0.5"}>
      {NAVEGACION.map((item) => {
        const activo = item.href === "/" ? ruta === "/" : ruta.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={activo ? "page" : undefined}
            className={[
              "whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors",
              activo
                ? "bg-neutral-100 font-medium text-neutral-950 dark:bg-neutral-800 dark:text-white"
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white",
            ].join(" ")}
          >
            {item.titulo}
          </Link>
        );
      })}
    </nav>
  );
}
