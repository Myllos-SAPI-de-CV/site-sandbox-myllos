"use client";

import "@scalar/api-reference-react/style.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { API_URL, LLAVE_PRUEBA } from "@/lib/config";

const ApiReferenceReact = dynamic(() => import("@scalar/api-reference-react").then((modulo) => modulo.ApiReferenceReact), {
  ssr: false,
  loading: () => <p className="py-10 text-sm text-neutral-500">Cargando referencia…</p>,
});

const URL_EN_VIVO = `${API_URL}/docs-json`;
const URL_COPIA = "/openapi.json";

type Fuente = { url: string; enVivo: boolean };

export function ReferenciaApi() {
  const [fuente, setFuente] = useState<Fuente | null>(null);

  useEffect(() => {
    fetch(URL_EN_VIVO, { signal: AbortSignal.timeout(3000), cache: "no-store" })
      .then((respuesta) => setFuente(respuesta.ok ? { url: URL_EN_VIVO, enVivo: true } : { url: URL_COPIA, enVivo: false }))
      .catch(() => setFuente({ url: URL_COPIA, enVivo: false }));
  }, []);

  if (!fuente) {
    return <p className="py-10 text-sm text-neutral-500">Buscando la especificación OpenAPI…</p>;
  }

  return (
    <>
      <p className="mb-4 text-xs text-neutral-500">
        {fuente.enVivo ? (
          <>
            Especificación en vivo de <code className="font-mono">{URL_EN_VIVO}</code>.
          </>
        ) : (
          <>
            La API no respondió en <code className="font-mono">{API_URL}</code>; se muestra la copia publicada con el sitio. Las pruebas desde esta página necesitan
            la API corriendo.
          </>
        )}
      </p>
      <div className="overflow-hidden rounded-lg border border-neutral-200">
        <ApiReferenceReact
          configuration={{
            url: fuente.url,
            hideClientButton: true,
            showDeveloperTools: "never",
            agent: { disabled: true },
            withDefaultFonts: false,
            forceDarkModeState: "light",
            hideDarkModeToggle: true,
            defaultHttpClient: { targetKey: "shell", clientKey: "curl" },
            authentication: { preferredSecurityScheme: "llave", securitySchemes: { llave: { token: LLAVE_PRUEBA } } },
          }}
        />
      </div>
    </>
  );
}
