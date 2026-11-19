"use client";

import { useSyncExternalStore } from "react";
import { CLAVE_TEMA } from "@/lib/config";

export type Esquema = "light" | "dark";

const preferenciaOscura = () => window.matchMedia("(prefers-color-scheme: dark)");
const metaEsquema = () => document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');

export function aplicarTema(valor: string | null) {
  const meta = metaEsquema();
  if (meta) meta.content = valor === "light" || valor === "dark" ? valor : "light dark";
}

export function esquemaVisible(): Esquema {
  const contenido = metaEsquema()?.content;
  if (contenido === "light" || contenido === "dark") return contenido;
  return preferenciaOscura().matches ? "dark" : "light";
}

export function alternarTema() {
  const destino: Esquema = esquemaVisible() === "dark" ? "light" : "dark";
  const sistema: Esquema = preferenciaOscura().matches ? "dark" : "light";
  const guardado = destino === sistema ? null : destino;
  try {
    if (guardado) localStorage.setItem(CLAVE_TEMA, guardado);
    else localStorage.removeItem(CLAVE_TEMA);
  } catch {}
  aplicarTema(guardado);
}

function suscribir(avisar: () => void) {
  const consulta = preferenciaOscura();
  const observador = new MutationObserver(avisar);
  const meta = metaEsquema();
  if (meta) observador.observe(meta, { attributes: true, attributeFilter: ["content"] });
  consulta.addEventListener("change", avisar);
  return () => {
    observador.disconnect();
    consulta.removeEventListener("change", avisar);
  };
}

export function useEsquema(): Esquema {
  return useSyncExternalStore(suscribir, esquemaVisible, () => "light");
}
