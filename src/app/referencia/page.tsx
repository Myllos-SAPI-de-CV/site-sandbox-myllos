import type { Metadata } from "next";
import { ReferenciaApi } from "@/components/ReferenciaApi";

export const metadata: Metadata = { title: "Referencia de la API" };

export default function Referencia() {
  return (
    <div>
      <div className="doc">
        <h1>Referencia de la API</h1>
        <p className="lead">
          Cada endpoint con sus campos, respuestas y errores. La llave de prueba ya está cargada para que pruebes las peticiones contra el sandbox desde aquí.
        </p>
      </div>
      <div className="mt-8">
        <ReferenciaApi />
      </div>
    </div>
  );
}
