export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8095").replace(/\/$/, "");
export const BASE_URL = `${API_URL}/v1`;
export const LLAVE_PRUEBA = "mk_test_dva_sandbox";

export const NAVEGACION = [
  { href: "/", titulo: "Inicio" },
  { href: "/autenticacion", titulo: "Autenticación" },
  { href: "/sandbox", titulo: "Guía del sandbox" },
  { href: "/referencia", titulo: "Referencia de la API" },
  { href: "/solicitud", titulo: "Respuesta a DVA" },
];
