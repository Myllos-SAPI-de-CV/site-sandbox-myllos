import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { BASE_URL, LLAVE_PRUEBA } from "@/lib/config";

export const metadata: Metadata = { title: "Respuesta a DVA" };

const FLUJO: [string, ReactNode][] = [
  ["El cliente final elige productos y da el CP de destino.", "Sin llamada a Myllos."],
  [
    "La plataforma calcula peso real y volumétrico y toma el mayor.",
    <>
      Recomendamos enviar el peso real y las medidas de cada caja. Myllos aplica la fórmula y devuelve <code>peso.cobrado_kg</code>, así el precio que ve el
      cliente es el que se cobra.
    </>,
  ],
  [
    "Pide la cotización con CP de origen y destino.",
    <>
      <code>POST /v1/cotizaciones</code>
    </>,
  ],
  [
    "Muestra la opción más económica y la más rápida.",
    "La respuesta trae Económico y Express ordenados por precio, con días hábiles y fecha estimada de entrega.",
  ],
  [
    "Con el pedido pagado, el negocio confirma peso y caja.",
    "Se cotiza de nuevo con los datos finales. Con los mismos datos la tarifa no cambia; si el peso o la caja cambiaron, el precio se actualiza antes de comprar.",
  ],
  [
    "La plataforma compra la guía y entrega la etiqueta.",
    <>
      <code>POST /v1/guias</code> con <code>Idempotency-Key</code>, y <code>GET /v1/guias/&#123;id&#125;/etiqueta</code> en PDF o ZPL.
    </>,
  ],
  [
    "Número de guía y rastreo quedan en el pedido.",
    <>
      La respuesta trae <code>numero_guia</code> y <code>rastreo_url</code>. Cada cambio llega por el webhook <code>envio.estado</code>.
    </>,
  ],
];

const OPERACIONES: [string, string, string][] = [
  ["Cotizar", "POST", "/v1/cotizaciones"],
  ["Generar guía", "POST", "/v1/guias"],
  ["Obtener la etiqueta", "GET", "/v1/guias/{id}/etiqueta"],
  ["Consultar el rastreo", "GET", "/v1/rastreo/{numero}"],
  ["Cancelar con reembolso", "DELETE", "/v1/guias/{id}"],
  ["Consultar saldo", "GET", "/v1/saldo"],
  ["Registrar webhooks", "POST", "/v1/webhooks"],
];

const RECLAMOS: [string, string][] = [
  ["Daño visible", "24 horas desde la entrega"],
  ["Daño oculto", "7 días naturales desde la entrega"],
  ["Extravío", "30 días naturales desde la emisión de la guía"],
];

const PASOS: [string, string, string][] = [
  ["Llamada de 30 minutos", "Proponemos agendarla esta semana, con alguien de producto y alguien técnico de cada lado.", "Por agendar"],
  ["Documentación y condiciones", "Están en este sitio: guía, referencia de la API y esta respuesta.", "Listo"],
  ["Integración de prueba", `Sandbox disponible con la llave ${LLAVE_PRUEBA}.`, "Listo para empezar"],
  ["Firma y puesta en marcha", "Validada la integración en sandbox, firmamos y entregamos la llave de producción para los primeros negocios.", "Después de la prueba"],
];

export default function Solicitud() {
  return (
    <article className="doc">
      <p className="!mt-0 text-sm font-medium uppercase tracking-wide text-neutral-500">DVA Response AI™ × Myllos Logística</p>
      <h1 className="mt-2">Respuesta a la solicitud de integración</h1>

      <table>
        <tbody>
          <tr>
            <td className="w-32 font-medium text-neutral-900">Para</td>
            <td>Iván Torres, DVAWeb · DVA Response AI™</td>
          </tr>
          <tr>
            <td className="font-medium text-neutral-900">De</td>
            <td>Ing. Raúl Valenzuela, Director General, Myllos Logística</td>
          </tr>
          <tr>
            <td className="font-medium text-neutral-900">Fecha</td>
            <td>19 de noviembre de 2026</td>
          </tr>
          <tr>
            <td className="font-medium text-neutral-900">Referencia</td>
            <td>Solicitud de integración del 11 de noviembre de 2026</td>
          </tr>
        </tbody>
      </table>

      <p>Estimado Iván:</p>
      <p>
        Gracias por considerar a Myllos como proveedor de envíos de DVA Response AI. El flujo que describen se opera con nuestra API de integraciones: un solo
        punto de conexión para cotizar, generar la guía, obtener la etiqueta y consultar el rastreo, sin que DVA tenga que elegir paquetería ni conectarse a varios
        sistemas.
      </p>
      <p>
        El ambiente de pruebas ya está disponible. Respondemos cada punto en el orden de su carta; las respuestas técnicas enlazan a la documentación de este
        sitio, donde se pueden probar.
      </p>

      <h2 id="flujo">El flujo de un envío</h2>
      <p>Así queda cada paso de su propuesta:</p>
      <table>
        <thead>
          <tr>
            <th className="w-8">#</th>
            <th className="w-1/3">Paso de DVA</th>
            <th>En la API de Myllos</th>
          </tr>
        </thead>
        <tbody>
          {FLUJO.map(([paso, respuesta], indice) => (
            <tr key={indice}>
              <td>{indice + 1}</td>
              <td>{paso}</td>
              <td>{respuesta}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 id="modelo">Modelo comercial</h2>
      <p>Estamos de acuerdo con el esquema que proponen:</p>
      <ul>
        <li>DVA es cliente de Myllos, con una cuenta y una llave de integración. Myllos le factura a DVA y DVA le factura al negocio.</li>
        <li>
          El negocio es el remitente. La guía se emite con su nombre y la dirección de origen que DVA envía en cada guía, así que un negocio puede tener varios
          orígenes sin configurar nada en Myllos.
        </li>
        <li>DVA define su margen y el precio al negocio. La tarifa de Myllos a DVA solo la ve DVA.</li>
        <li>
          El prepago de los negocios en DVA encaja con el saldo de prepago de la cuenta de DVA en Myllos. Si el saldo no alcanza, la API rechaza la guía con{" "}
          <code>402 saldo_insuficiente</code> y no se emite nada a crédito.
        </li>
      </ul>

      <h3 id="ajustes">Ajustes posteriores</h3>
      <ul>
        <li>
          <strong>Cómo se determinan.</strong> La paquetería verifica peso y medidas en su red. Si el peso cobrado verificado supera el de la guía, se recalcula
          el flete con la misma tarifa y se cobra la diferencia. La zona extendida no es un ajuste posterior: se identifica por el código postal de destino y ya
          viene en la cotización.
        </li>
        <li>
          <strong>Cómo se notifican.</strong> Con el webhook <code>envio.ajuste</code>, que trae peso anterior, peso verificado y monto. El ajuste también queda
          en la guía.
        </li>
        <li>
          <strong>Cómo se cobran.</strong> Se descuentan del saldo de prepago de DVA al registrarse. DVA puede trasladarlos al negocio con el detalle del aviso.
        </li>
        <li>
          <strong>Plazo.</strong> Se avisan en cuanto la paquetería reporta la verificación, normalmente dentro de los 7 días hábiles posteriores a la
          recolección.
        </li>
      </ul>

      <h2 id="tecnica">Información técnica</h2>

      <h3>1. Documentación de la API</h3>
      <p>
        Está en este sitio: la <Link href="/sandbox">guía del sandbox</Link> con el flujo completo y la <Link href="/referencia">referencia de la API</Link> con
        cada campo. Las cuatro operaciones que piden, y las que las complementan:
      </p>
      <table>
        <thead>
          <tr>
            <th>Operación</th>
            <th>Método</th>
            <th>Ruta</th>
          </tr>
        </thead>
        <tbody>
          {OPERACIONES.map(([operacion, metodo, ruta]) => (
            <tr key={ruta + metodo}>
              <td>{operacion}</td>
              <td>{metodo}</td>
              <td>
                <code>{ruta}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>2. Ambiente de pruebas y credenciales</h3>
      <p>
        URL base <code>{BASE_URL}</code> y llave <code>{LLAVE_PRUEBA}</code>, con 5,000 MXN de saldo de prueba. El sandbox simula el avance del rastreo, el
        sobrepeso y la cancelación, y no recolecta ni cobra. La llave de producción, con prefijo <code>mk_live_</code>, se entrega al firmar.
      </p>

      <h3>3. Avisos automáticos</h3>
      <p>
        Sí. <code>envio.estado</code> avisa cada cambio de estado del envío y <code>envio.ajuste</code> cada cargo posterior, como sobrepeso. Cada aviso va
        firmado con HMAC-SHA256 para que DVA verifique que viene de Myllos. Detalle en <Link href="/sandbox#webhooks">Webhooks</Link>.
      </p>

      <h3>4. Formato de la etiqueta</h3>
      <p>
        PDF y ZPL, de 4 × 6 pulgadas (10 × 15 cm). El ZPL está a 203 dpi para impresoras térmicas Zebra. Se elige con <code>formato=pdf</code> o{" "}
        <code>formato=zpl</code>.
      </p>

      <h3>5. Fórmula de peso volumétrico</h3>
      <p>
        <code>(largo × ancho × alto) / 5000</code>, con medidas en centímetros y resultado en kilogramos. Por caja se cobra el mayor entre el peso real y el
        volumétrico, redondeado al kilogramo superior. Por ejemplo, una caja de 30 × 20 × 15 cm pesa 1.8 kg volumétricos; con 1.2 kg reales se cobran 2 kg.
      </p>

      <h2 id="comercial">Información comercial</h2>

      <h3>1. Condiciones para revendedores</h3>
      <p>No pedimos un mínimo de guías para arrancar. La tarifa mejora con el volumen:</p>
      <table>
        <thead>
          <tr>
            <th>Envíos diarios promedio</th>
            <th>Tarifa</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Menos de 300</td>
            <td>Tarifa de lista</td>
          </tr>
          <tr>
            <td>De 300 a 999</td>
            <td>5% de descuento</td>
          </tr>
          <tr>
            <td>1,000 o más</td>
            <td>10% de descuento</td>
          </tr>
        </tbody>
      </table>
      <p>El promedio se mide con el mes calendario anterior y el descuento aplica al flete del mes siguiente.</p>

      <h3>2. Paqueterías y tipos de servicio</h3>
      <p>
        Dos servicios: <strong>Económico</strong>, terrestre, de 3 a 5 días hábiles, y <strong>Express</strong>, de 1 a 2 días hábiles. Myllos asigna la
        paquetería de su red según la ruta y el servicio. DVA recibe un solo número de guía y un solo rastreo, sin integrar cada paquetería.
      </p>

      <h3>3. Cobertura y zonas extendidas</h3>
      <p>
        Cobertura nacional. La zona extendida se identifica por el código postal de destino y aparece en la cotización como <code>zona_extendida: true</code>,
        con su cargo en el desglose. DVA la ve antes de comprar la guía, no como un cargo posterior.
      </p>

      <h3>4. Servicios adicionales</h3>
      <table>
        <thead>
          <tr>
            <th>Servicio</th>
            <th>Costo, IVA incluido</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Recolección en el domicilio de origen</td>
            <td>$45 por guía</td>
          </tr>
          <tr>
            <td>Seguro sobre el valor declarado</td>
            <td>2% del valor declarado, mínimo $25</td>
          </tr>
          <tr>
            <td>Acuse de recibo</td>
            <td>$35 por guía</td>
          </tr>
          <tr>
            <td>Zona extendida</td>
            <td>$120 por guía</td>
          </tr>
        </tbody>
      </table>
      <p>Cada uno se pide en la cotización y viaja desglosado en el precio.</p>

      <h3>5. Cobro y plazo de los ajustes</h3>
      <p>
        Se descuentan del saldo de prepago al registrarse y se avisan por <code>envio.ajuste</code>, normalmente dentro de los 7 días hábiles posteriores a la
        recolección. Si un ajuste deja el saldo en negativo, no se emiten guías nuevas hasta cubrirlo.
      </p>

      <h3>6. Forma de pago y facturación</h3>
      <p>
        Prepago desde el arranque: DVA recarga su saldo y cada guía se descuenta al emitirse. Una vez que la operación alcance el volumen que acordemos en el
        contrato, podemos abrir una línea de crédito con base en el historial de los primeros meses. Facturamos con CFDI mensual a nombre de DVA, con el detalle
        de guías, cancelaciones y ajustes del periodo.
      </p>

      <h3>7. Vigencia, cancelación y reembolso</h3>
      <p>
        Una guía generada y no usada está vigente 30 días. Se cancela mientras no se haya recolectado, y el reembolso es íntegro al saldo: costo de la guía,
        adicionales y ajustes. Después de la recolección ya no se cancela.
      </p>

      <h3>8. Extravíos y daños</h3>
      <table>
        <thead>
          <tr>
            <th>Caso</th>
            <th>Plazo para reclamar</th>
          </tr>
        </thead>
        <tbody>
          {RECLAMOS.map(([caso, plazo]) => (
            <tr key={caso}>
              <td>{caso}</td>
              <td>{plazo}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        DVA levanta el reclamo con el número de guía, fotos del empaque y del contenido, y el comprobante del valor. Respondemos en 15 días hábiles. Con seguro,
        la indemnización llega hasta el valor declarado; sin seguro, aplica el límite de responsabilidad de la paquetería.
      </p>

      <h3>9. Contrato y términos</h3>
      <p>
        Aplican los <a href="#terminos">términos de la integración</a> que aparecen al final de esta respuesta. Los formalizamos en un contrato de prestación de
        servicios con un anexo de integración. Para prepararlo necesitamos la constancia de situación fiscal de DVAWeb, el poder de quien firma y los datos de
        facturación.
      </p>

      <h2 id="volumen">Volumen y condiciones</h2>
      <p>
        Con la proyección de 1,000 envíos diarios, DVA entra en la tarifa con 10% de descuento desde el mes siguiente a alcanzarla. Sobre lo que piden para
        ofrecer un precio competitivo:
      </p>
      <ul>
        <li>
          <strong>Tarifas preferenciales por volumen:</strong> la tabla de la sección comercial, medida cada mes.
        </li>
        <li>
          <strong>Pago y crédito:</strong> prepago desde el primer día y línea de crédito al alcanzar el volumen acordado.
        </li>
        <li>
          <strong>Acompañamiento:</strong> un canal técnico directo durante la integración, revisión conjunta de la integración en sandbox antes de pasar a
          producción, y seguimiento de las primeras guías y ajustes con los primeros negocios.
        </li>
      </ul>

      <h2 id="pasos">Siguientes pasos</h2>
      <table>
        <thead>
          <tr>
            <th className="w-8">#</th>
            <th>Paso</th>
            <th>Detalle</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {PASOS.map(([paso, detalle, estado], indice) => (
            <tr key={paso}>
              <td>{indice + 1}</td>
              <td className="font-medium text-neutral-900">{paso}</td>
              <td>{detalle}</td>
              <td className="whitespace-nowrap">{estado}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>Quedamos atentos para agendar la llamada.</p>
      <p>
        Atentamente,
        <br />
        <strong>Ing. Raúl Valenzuela</strong>
        <br />
        Director General, Myllos Logística
      </p>

      <h2 id="terminos">Términos de la integración</h2>
      <ul>
        <li>
          <strong>Alcance.</strong> Cotización, guías, etiquetas, rastreo, cancelación, saldo y webhooks en la versión <code>/v1</code> de la API.
        </li>
        <li>
          <strong>Precio.</strong> Se cobra la tarifa vigente al cotizar, con IVA incluido y el descuento por volumen que corresponda.
        </li>
        <li>
          <strong>Pago.</strong> Prepago. Sin saldo suficiente no se emite la guía.
        </li>
        <li>
          <strong>Ajustes.</strong> Se descuentan del saldo y se avisan por webhook.
        </li>
        <li>
          <strong>Cancelación.</strong> Hasta 30 días, mientras la guía no se haya recolectado, con reembolso íntegro al saldo.
        </li>
        <li>
          <strong>Remitente.</strong> El negocio declara contenido, peso y valor, y responde por su exactitud y por no enviar artículos prohibidos. DVA traslada
          esta obligación a los negocios de su plataforma.
        </li>
        <li>
          <strong>Reclamos.</strong> En los plazos de la tabla de extravíos y daños, con respuesta en 15 días hábiles.
        </li>
        <li>
          <strong>Facturación.</strong> CFDI mensual a nombre de DVA.
        </li>
        <li>
          <strong>Llaves.</strong> Son confidenciales. DVA responde por el uso de las llaves de su cuenta y avisa de inmediato si alguna se expone.
        </li>
        <li>
          <strong>Cambios a la API.</strong> Los cambios compatibles se publican en <code>/v1</code>. Los que rompen compatibilidad van a una versión nueva, con
          90 días de aviso.
        </li>
      </ul>
      <p className="text-sm text-neutral-500">
        Las condiciones comerciales de esta respuesta son la propuesta de Myllos para la integración y quedan sujetas a la firma del contrato.
      </p>
    </article>
  );
}
