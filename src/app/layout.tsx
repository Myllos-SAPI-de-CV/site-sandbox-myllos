import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { EstadoApi } from "@/components/EstadoApi";
import { Navegacion } from "@/components/Navegacion";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Integraciones Myllos · Sandbox", template: "%s · Integraciones Myllos" },
  description: "Documentación de la API de integraciones de Myllos: cotizar, generar guías, etiquetas, rastreo y webhooks en un solo punto de conexión.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="text-[15px] font-bold tracking-tight text-neutral-950">MYLLOS</span>
              <span className="text-sm text-neutral-500">Integraciones</span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800">Sandbox</span>
            </Link>
            <EstadoApi />
          </div>
          <div className="border-t border-neutral-100 px-4 py-2 lg:hidden">
            <Navegacion horizontal />
          </div>
        </header>

        <div className="mx-auto flex max-w-7xl gap-10 px-4 sm:px-6">
          <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 py-8 lg:block">
            <Navegacion />
          </aside>
          <main className="min-w-0 flex-1 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
