export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8095").replace(/\/$/, "");
export const BASE_URL = `${API_URL}/v1`;
export const LLAVE_PRUEBA = "mk_test_sandbox";

export const CLAVE_TEMA = "color-scheme";
export const SCRIPT_TEMA = `try{document.querySelector('meta[name="color-scheme"]').content=localStorage.getItem("${CLAVE_TEMA}")??"light dark"}catch(e){}`;

export const NAVEGACION = [
  { href: "/", titulo: "Inicio" },
  { href: "/autenticacion", titulo: "Autenticación" },
  { href: "/sandbox", titulo: "Guía del sandbox" },
  { href: "/referencia", titulo: "Referencia de la API" },
];
