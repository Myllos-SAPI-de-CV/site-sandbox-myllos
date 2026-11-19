import { BASE_URL, LLAVE_PRUEBA } from "./config";

const AUTORIZACION = `-H "Authorization: Bearer ${LLAVE_PRUEBA}"`;

export const CURL_COTIZAR = `curl -X POST ${BASE_URL}/cotizaciones \\
  ${AUTORIZACION} \\
  -H "Content-Type: application/json" \\
  -d '{
    "codigo_postal_origen": "80000",
    "codigo_postal_destino": "06600",
    "paquetes": [{ "peso": 1.2, "largo": 30, "ancho": 20, "alto": 15 }],
    "recoleccion": true
  }'`;

export const RESPUESTA_COTIZAR = `{
  "vence_en": "2026-11-19T15:30:00.000Z",
  "opciones": [
    {
      "cotizacion_id": "cot_3f9a1c2b7d4e5f60",
      "servicio": "economico",
      "nombre": "Económico",
      "dias_habiles_min": 3,
      "dias_habiles_max": 5,
      "fecha_estimada_entrega": "2026-11-26",
      "zona": "nacional",
      "zona_extendida": false,
      "peso": { "real_kg": 1.2, "volumetrico_kg": 1.8, "cobrado_kg": 2 },
      "desglose": { "flete": 167, "zona_extendida": 0, "recoleccion": 45, "seguro": 0, "acuse_recibo": 0 },
      "precio_total": 212,
      "moneda": "MXN",
      "vence_en": "2026-11-19T15:30:00.000Z"
    },
    {
      "cotizacion_id": "cot_8b2d4f6a1c3e5b70",
      "servicio": "express",
      "nombre": "Express",
      "precio_total": 298,
      "...": "mismos campos"
    }
  ]
}`;

export const CURL_GUIA = `curl -X POST ${BASE_URL}/guias \\
  ${AUTORIZACION} \\
  -H "Idempotency-Key: pedido-10234" \\
  -H "Content-Type: application/json" \\
  -d '{
    "cotizacion_id": "cot_3f9a1c2b7d4e5f60",
    "referencia": "PED-10234",
    "contenido": "Ropa",
    "origen": {
      "nombre": "Ana López", "empresa": "Tienda Ana", "telefono": "6671234567",
      "calle": "Av. Obregón", "numero": "123", "colonia": "Centro",
      "ciudad": "Culiacán", "estado": "Sinaloa", "codigo_postal": "80000"
    },
    "destino": {
      "nombre": "Luis Pérez", "telefono": "5512345678",
      "calle": "Insurgentes Sur", "numero": "1000", "colonia": "Del Valle",
      "ciudad": "Ciudad de México", "estado": "CDMX", "codigo_postal": "06600"
    }
  }'`;

export const RESPUESTA_GUIA = `{
  "id": "gui_1a2b3c4d5e6f7a8b",
  "numero_guia": "MYLTEST4821930576",
  "estado": "documentada",
  "servicio": "economico",
  "costo": 212,
  "moneda": "MXN",
  "referencia": "PED-10234",
  "peso_cobrado_vigente_kg": 2,
  "fecha_estimada_entrega": "2026-11-26",
  "cancelable_hasta": "2026-12-19T15:00:00.000Z",
  "etiqueta": {
    "pdf": "${BASE_URL}/guias/gui_1a2b3c4d5e6f7a8b/etiqueta?formato=pdf",
    "zpl": "${BASE_URL}/guias/gui_1a2b3c4d5e6f7a8b/etiqueta?formato=zpl"
  },
  "rastreo_url": "${BASE_URL}/rastreo/MYLTEST4821930576",
  "ajustes": [],
  "saldo_disponible": 4788
}`;

export const CURL_ETIQUETA = `curl ${BASE_URL}/guias/gui_1a2b3c4d5e6f7a8b/etiqueta?formato=pdf \\
  ${AUTORIZACION} \\
  -o MYLTEST4821930576.pdf`;

export const CURL_RASTREO = `curl ${BASE_URL}/rastreo/MYLTEST4821930576 \\
  ${AUTORIZACION}`;

export const CURL_CANCELAR = `curl -X DELETE ${BASE_URL}/guias/gui_1a2b3c4d5e6f7a8b \\
  ${AUTORIZACION}`;

export const CURL_WEBHOOK = `curl -X POST ${BASE_URL}/webhooks \\
  ${AUTORIZACION} \\
  -H "Content-Type: application/json" \\
  -d '{ "url": "https://tu-sistema.mx/webhooks/myllos" }'`;

export const AVISO_AJUSTE = `{
  "id": "evt_5c1e9a7b3d2f4a60",
  "evento": "envio.ajuste",
  "ambiente": "sandbox",
  "creado_en": "2026-11-20T18:04:11.000Z",
  "datos": {
    "guia_id": "gui_1a2b3c4d5e6f7a8b",
    "numero_guia": "MYLTEST4821930576",
    "referencia": "PED-10234",
    "id": "aju_7d3b1f9e2c4a6b80",
    "tipo": "sobrepeso",
    "peso_cobrado_anterior_kg": 2,
    "peso_verificado_kg": 4,
    "peso_cobrado_nuevo_kg": 4,
    "monto": 24,
    "fecha": "2026-11-20T18:04:11.000Z",
    "moneda": "MXN",
    "saldo_disponible": 4764
  }
}`;

export const AVISO_ESTADO = `{
  "id": "evt_0b8e6c4a2d1f3e50",
  "evento": "envio.estado",
  "ambiente": "sandbox",
  "creado_en": "2026-11-19T15:10:30.000Z",
  "datos": {
    "guia_id": "gui_1a2b3c4d5e6f7a8b",
    "numero_guia": "MYLTEST4821930576",
    "referencia": "PED-10234",
    "estado_anterior": "documentada",
    "estado": "recolectada"
  }
}`;

export const VERIFICAR_FIRMA = `import { createHmac, timingSafeEqual } from "node:crypto";

// encabezado: valor de X-Myllos-Firma, por ejemplo "t=1763564670,v1=4f1c..."
// cuerpo: el body tal como llegó, sin volver a serializarlo
export function firmaValida(encabezado, cuerpo, secreto) {
  const partes = Object.fromEntries(encabezado.split(",").map((parte) => parte.split("=")));
  const esperada = createHmac("sha256", secreto).update(\`\${partes.t}.\${cuerpo}\`).digest("hex");
  const reciente = Math.abs(Date.now() / 1000 - Number(partes.t)) < 300;
  return reciente && partes.v1?.length === esperada.length && timingSafeEqual(Buffer.from(partes.v1), Buffer.from(esperada));
}`;

export const CURL_AJUSTE = `curl -X POST ${BASE_URL}/sandbox/guias/gui_1a2b3c4d5e6f7a8b/simular-ajuste \\
  ${AUTORIZACION} \\
  -H "Content-Type: application/json" \\
  -d '{ "peso_verificado_kg": 4 }'`;

export const CURL_RESTABLECER = `curl -X POST ${BASE_URL}/sandbox/saldo/restablecer \\
  ${AUTORIZACION}`;

export const ERROR_EJEMPLO = `{
  "codigo": "saldo_insuficiente",
  "mensaje": "El saldo disponible no cubre el costo de la guía.",
  "detalle": { "saldo_disponible": 120, "costo": 212 }
}`;
