"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/config";

type Estado = "consultando" | "en_linea" | "sin_respuesta";

const INTERVALO_MS = 30_000;

export function EstadoApi() {
  const [estado, setEstado] = useState<Estado>("consultando");

  useEffect(() => {
    let activo = true;

    const consultar = async () => {
      try {
        const respuesta = await fetch(`${API_URL}/v1/estado`, { signal: AbortSignal.timeout(4000), cache: "no-store" });
        if (activo) setEstado(respuesta.ok ? "en_linea" : "sin_respuesta");
      } catch {
        if (activo) setEstado("sin_respuesta");
      }
    };

    consultar();
    const temporizador = setInterval(consultar, INTERVALO_MS);
    return () => {
      activo = false;
      clearInterval(temporizador);
    };
  }, []);

  const color = { consultando: "bg-neutral-300", en_linea: "bg-emerald-500", sin_respuesta: "bg-red-500" }[estado];
  const texto = { consultando: "Consultando API", en_linea: "API en línea", sin_respuesta: "API sin respuesta" }[estado];

  return (
    <span className="flex items-center gap-2 text-xs text-neutral-600" title={`${API_URL}/v1/estado`}>
      <span className={`size-2 rounded-full ${color}`} aria-hidden />
      {texto}
    </span>
  );
}
