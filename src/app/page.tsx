import Link from "next/link";
import { Aviso } from "@/components/Aviso";
import { Codigo } from "@/components/Codigo";
import { API_URL, BASE_URL, LLAVE_PRUEBA } from "@/lib/config";
import { CURL_COTIZAR, RESPUESTA_COTIZAR } from "@/lib/ejemplos";

const SIGUIENTES = [
  { href: "/autenticacion", titulo: "Autenticación", texto: "Cómo enviar la llave y qué responde la API si falta." },
  { href: "/sandbox", titulo: "Guía del sandbox", texto: "El flujo completo con ejemplos, reglas de cobro, webhooks y errores." },
  { href: "/referencia", titulo: "Referencia de la API", texto: "Cada endpoint con sus campos, respuestas y un cliente para probar." },
  { href: "/solicitud", titulo: "Respuesta a DVA", texto: "Respuesta punto por punto a la solicitud de integración de DVA Response AI." },
];

export default function Inicio() {
  return (
    <article className="doc">
      <h1>Integraciones Myllos</h1>
      <p className="lead">
        Una sola API para cotizar envíos, generar guías, descargar etiquetas y rastrear paquetes desde tu plataforma. No eliges paquetería ni hablas con varios
        sistemas: Myllos asigna la paquetería y siempre responde con el mismo formato.
      </p>

      <Aviso tipo="importante" titulo="Estás en el sandbox">
        Las guías son de prueba: nadie recolecta, el saldo es ficticio y no se emite CFDI. El contrato de la API es el mismo que usará producción; solo cambian la
        URL base y la llave.
      </Aviso>

      <h2 id="conexion">Datos de conexión</h2>
      <table>
        <tbody>
          <tr>
            <td className="w-40 font-medium text-neutral-900">URL base</td>
            <td>
              <code>{BASE_URL}</code>
            </td>
          </tr>
          <tr>
            <td className="font-medium text-neutral-900">Autenticación</td>
            <td>
              <code>Authorization: Bearer {LLAVE_PRUEBA}</code>
            </td>
          </tr>
          <tr>
            <td className="font-medium text-neutral-900">Formato</td>
            <td>JSON en UTF-8. Importes en MXN con IVA incluido; pesos en kilogramos y medidas en centímetros.</td>
          </tr>
          <tr>
            <td className="font-medium text-neutral-900">OpenAPI</td>
            <td>
              <code>{API_URL}/docs-json</code>
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="flujo">El flujo de un envío</h2>
      <ol>
        <li>
          <strong>Cotiza</strong> con códigos postales, peso y medidas en <code>POST /v1/cotizaciones</code>. Recibes Económico y Express con precio total, días
          hábiles y el peso que se cobra.
        </li>
        <li>
          <strong>Muestra las opciones</strong> a tu cliente. Cada una trae un <code>cotizacion_id</code> que vence a los 30 minutos y sirve para una sola guía.
        </li>
        <li>
          <strong>Genera la guía</strong> cuando el pedido esté pagado, en <code>POST /v1/guias</code>, con el <code>cotizacion_id</code>, remitente, destinatario y
          un encabezado <code>Idempotency-Key</code>. El costo se descuenta del saldo de prepago.
        </li>
        <li>
          <strong>Descarga la etiqueta</strong> en PDF o ZPL con <code>GET /v1/guias/&#123;id&#125;/etiqueta</code>.
        </li>
        <li>
          <strong>Rastrea</strong> con <code>GET /v1/rastreo/&#123;numero&#125;</code>, o recibe cada cambio de estado por webhook.
        </li>
      </ol>

      <h2 id="primera-llamada">Primera llamada</h2>
      <p>Con la API corriendo, esta petición cotiza un paquete de Culiacán a la Ciudad de México:</p>
      <Codigo codigo={CURL_COTIZAR} />
      <p>La respuesta trae una opción por servicio, ordenadas de menor a mayor precio:</p>
      <Codigo codigo={RESPUESTA_COTIZAR} titulo="200 OK" />

      <h2 id="siguiente">Siguiente</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {SIGUIENTES.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-lg border border-neutral-200 p-4 !no-underline transition-colors hover:border-neutral-400">
            <span className="block font-semibold text-neutral-950">{item.titulo}</span>
            <span className="mt-1 block text-sm font-normal text-neutral-600">{item.texto}</span>
          </Link>
        ))}
      </div>
    </article>
  );
}
