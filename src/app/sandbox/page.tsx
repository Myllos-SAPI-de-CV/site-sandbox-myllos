import type { Metadata } from "next";
import { Aviso } from "@/components/Aviso";
import { Codigo } from "@/components/Codigo";
import {
  AVISO_AJUSTE,
  AVISO_ESTADO,
  CURL_AJUSTE,
  CURL_CANCELAR,
  CURL_COTIZAR,
  CURL_ETIQUETA,
  CURL_GUIA,
  CURL_RASTREO,
  CURL_RESTABLECER,
  CURL_WEBHOOK,
  ERROR_EJEMPLO,
  RESPUESTA_GUIA,
  VERIFICAR_FIRMA,
} from "@/lib/ejemplos";

export const metadata: Metadata = { title: "Guía del sandbox" };

const INDICE = [
  ["saldo", "Saldo de prueba"],
  ["cotizar", "Cotizar"],
  ["guia", "Generar la guía"],
  ["etiqueta", "Etiqueta"],
  ["rastreo", "Rastreo"],
  ["cancelar", "Cancelar"],
  ["webhooks", "Webhooks"],
  ["ajustes", "Ajustes por sobrepeso"],
  ["errores", "Códigos de error"],
];

const ERRORES: [number, string, string][] = [
  [400, "datos_invalidos", "Un campo falta o no cumple el formato. detalle.campos lista cada problema."],
  [400, "idempotency_key_requerida", "POST /v1/guias sin Idempotency-Key, o con menos de 8 caracteres."],
  [401, "no_autorizado", "Falta el encabezado Authorization: Bearer."],
  [401, "llave_invalida", "La llave no existe o fue revocada."],
  [402, "saldo_insuficiente", "El saldo no cubre el costo de la guía. detalle trae saldo y costo."],
  [404, "cotizacion_no_encontrada", "La cotizacion_id no existe en esta cuenta."],
  [404, "guia_no_encontrada", "La guía o el número de guía no existe en esta cuenta."],
  [404, "webhook_no_encontrado", "El webhook no existe en esta cuenta."],
  [409, "cotizacion_usada", "La cotización ya generó una guía."],
  [409, "guia_cancelada", "La guía ya está cancelada."],
  [409, "guia_no_cancelable", "La guía ya salió de documentada."],
  [409, "guia_vencida", "Pasaron los 30 días para cancelarla."],
  [409, "limite_webhooks", "La cuenta ya tiene 5 webhooks."],
  [410, "cotizacion_vencida", "Pasaron los 30 minutos de vigencia de la cotización."],
  [422, "codigo_postal_no_coincide", "El CP de origen o destino es distinto al cotizado."],
  [422, "idempotencia_conflicto", "La Idempotency-Key ya se usó con otros datos."],
  [422, "sin_diferencia", "El peso simulado no supera el peso cobrado."],
  [500, "error_interno", "Falla del lado de Myllos. Reintenta con la misma Idempotency-Key."],
];

export default function GuiaSandbox() {
  return (
    <article className="doc">
      <h1>Guía del sandbox</h1>
      <p className="lead">
        El recorrido completo de un envío, de la cotización al rastreo, con las reglas que aplica el sandbox. Los ejemplos usan la llave de prueba y se pueden
        copiar tal cual.
      </p>

      <nav aria-label="En esta página" className="mt-6 flex flex-wrap gap-2">
        {INDICE.map(([id, titulo]) => (
          <a key={id} href={`#${id}`} className="rounded-full border border-neutral-200 px-3 py-1 text-xs !font-normal !no-underline text-neutral-600 hover:border-neutral-400">
            {titulo}
          </a>
        ))}
      </nav>

      <h2 id="saldo">Saldo de prueba</h2>
      <p>
        Cada llave arranca con <strong>5,000 MXN</strong> de saldo de prepago. Generar una guía lo descuenta; cancelarla lo devuelve; un ajuste por sobrepeso lo
        descuenta de nuevo. Consulta saldo y movimientos con <code>GET /v1/saldo</code>.
      </p>
      <p>Si te quedas sin saldo de prueba, regrésalo a 5,000 MXN:</p>
      <Codigo codigo={CURL_RESTABLECER} />

      <h2 id="cotizar">Cotizar</h2>
      <Codigo codigo={CURL_COTIZAR} />
      <p>
        Envía el peso real y las medidas de cada bulto (de 1 a 10 por envío). Myllos calcula el peso volumétrico y te dice cuál cobra, para que el precio que
        muestras sea el que se descuenta.
      </p>

      <h3>Peso cobrado</h3>
      <ul>
        <li>
          Peso volumétrico por bulto: <code>(largo × ancho × alto) / 5000</code>, con medidas en centímetros y resultado en kilogramos.
        </li>
        <li>Por bulto se cobra el mayor entre el peso real y el volumétrico, redondeado al kilogramo superior. El peso cobrado del envío es la suma.</li>
        <li>Cada bulto admite de 0.1 a 59 kg y hasta 200 cm por lado.</li>
      </ul>

      <h3>Servicios y tarifa del sandbox</h3>
      <p>La zona sale del prefijo del código postal: mismos dos primeros dígitos es local, mismo primer dígito es regional y lo demás es nacional.</p>
      <table>
        <thead>
          <tr>
            <th>Servicio</th>
            <th>Entrega</th>
            <th>Local</th>
            <th>Regional</th>
            <th>Nacional</th>
            <th>Kg adicional</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Económico</td>
            <td>3 a 5 días hábiles</td>
            <td>$95</td>
            <td>$125</td>
            <td>$155</td>
            <td>$12</td>
          </tr>
          <tr>
            <td>Express</td>
            <td>1 a 2 días hábiles</td>
            <td>$145</td>
            <td>$189</td>
            <td>$235</td>
            <td>$18</td>
          </tr>
        </tbody>
      </table>
      <p>La tarifa base cubre el primer kilogramo cobrado. Los importes son en MXN con IVA incluido.</p>

      <h3>Adicionales y zona extendida</h3>
      <table>
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Cómo se pide</th>
            <th>Cargo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Recolección en origen</td>
            <td>
              <code>&quot;recoleccion&quot;: true</code>
            </td>
            <td>$45</td>
          </tr>
          <tr>
            <td>Seguro</td>
            <td>
              <code>&quot;seguro&quot;: true</code> y <code>valor_declarado</code>
            </td>
            <td>2% del valor declarado, mínimo $25</td>
          </tr>
          <tr>
            <td>Acuse de recibo</td>
            <td>
              <code>&quot;acuse_recibo&quot;: true</code>
            </td>
            <td>$35</td>
          </tr>
          <tr>
            <td>Zona extendida</td>
            <td>Automático según el CP de destino</td>
            <td>$120</td>
          </tr>
        </tbody>
      </table>
      <p>
        La zona extendida se marca en la cotización con <code>zona_extendida: true</code> y su cargo va en el desglose, antes de comprar la guía. En el sandbox
        se marcan los destinos <code>23940</code>, <code>24350</code>, <code>29950</code>, <code>39970</code> y <code>86930</code>.
      </p>

      <h2 id="guia">Generar la guía</h2>
      <Codigo codigo={CURL_GUIA} />
      <Codigo codigo={RESPUESTA_GUIA} titulo="201 Created" />
      <ul>
        <li>
          El remitente es el negocio: la guía sale con el nombre y la dirección de <code>origen</code>. Un mismo negocio puede usar varios orígenes; solo cotiza
          con el código postal de cada uno.
        </li>
        <li>
          Los códigos postales de <code>origen</code> y <code>destino</code> deben ser los cotizados. Si el peso o la caja cambian al empacar, cotiza de nuevo.
        </li>
        <li>
          <code>referencia</code> es tu número de pedido. Se imprime en la etiqueta y regresa en cada webhook.
        </li>
      </ul>

      <h3>Idempotency-Key</h3>
      <p>
        Envía un valor único por guía, de 8 a 100 caracteres; el id de tu pedido funciona bien. Si la red falla y repites la petición con la misma llave y los
        mismos datos, recibes la misma guía con status <code>200</code> y el encabezado <code>Idempotency-Replayed: true</code>, sin un segundo cargo. Con la
        misma llave y datos distintos responde <code>422 idempotencia_conflicto</code>.
      </p>

      <h2 id="etiqueta">Etiqueta</h2>
      <Codigo codigo={CURL_ETIQUETA} />
      <p>
        Mide 4 × 6 pulgadas (10 × 15 cm). Pide <code>formato=pdf</code> para impresoras de oficina o <code>formato=zpl</code> para térmicas Zebra a 203 dpi. En
        sandbox la etiqueta lleva la marca SANDBOX y no sirve para enviar.
      </p>

      <h2 id="rastreo">Rastreo</h2>
      <Codigo codigo={CURL_RASTREO} />
      <p>En sandbox la guía avanza sola una etapa cada 10 minutos desde que se genera:</p>
      <table>
        <thead>
          <tr>
            <th>Minuto</th>
            <th>Estado</th>
            <th>Significado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>0</td>
            <td>
              <code>documentada</code>
            </td>
            <td>Guía generada, en espera de recolección o entrega en sucursal</td>
          </tr>
          <tr>
            <td>10</td>
            <td>
              <code>recolectada</code>
            </td>
            <td>Paquete recolectado en origen</td>
          </tr>
          <tr>
            <td>20</td>
            <td>
              <code>en_transito</code>
            </td>
            <td>En tránsito hacia la ciudad de destino</td>
          </tr>
          <tr>
            <td>30</td>
            <td>
              <code>en_reparto</code>
            </td>
            <td>En ruta de entrega</td>
          </tr>
          <tr>
            <td>40</td>
            <td>
              <code>entregada</code>
            </td>
            <td>Entregado al destinatario</td>
          </tr>
        </tbody>
      </table>

      <h2 id="cancelar">Cancelar</h2>
      <Codigo codigo={CURL_CANCELAR} />
      <p>
        Una guía se cancela mientras está <code>documentada</code> y dentro de los 30 días posteriores a su emisión. El reembolso es íntegro: el costo de la
        guía, con adicionales y ajustes, regresa al saldo. Después de la recolección responde <code>409 guia_no_cancelable</code>. En sandbox tienes los
        primeros 10 minutos para probarlo.
      </p>

      <h2 id="webhooks">Webhooks</h2>
      <p>Registra una URL para recibir los avisos de tus guías sin consultar el rastreo:</p>
      <Codigo codigo={CURL_WEBHOOK} />
      <p>
        La respuesta incluye un <code>secreto</code> que solo se muestra una vez. Guárdalo para verificar la firma. Hay dos eventos:
      </p>
      <ul>
        <li>
          <code>envio.estado</code>: la guía cambió de etapa o se canceló. Si avanzó varias etapas entre revisiones, llega el estado más reciente.
        </li>
        <li>
          <code>envio.ajuste</code>: hubo un cargo posterior, por ejemplo sobrepeso. Ya está descontado del saldo cuando llega el aviso.
        </li>
      </ul>
      <Codigo codigo={AVISO_ESTADO} titulo="POST a tu URL · envio.estado" />

      <h3>Verificar la firma</h3>
      <p>
        Cada aviso trae <code>X-Myllos-Firma: t=&lt;unix&gt;,v1=&lt;hex&gt;</code>. <code>v1</code> es HMAC-SHA256 de <code>&quot;&lt;t&gt;.&lt;cuerpo&gt;&quot;</code>{" "}
        con tu secreto. Rechaza el aviso si la firma no coincide o si <code>t</code> tiene más de 5 minutos.
      </p>
      <Codigo codigo={VERIFICAR_FIRMA} titulo="Node.js" />
      <p>
        Responde con un status 2xx en menos de 5 segundos. En sandbox se hace un intento por evento; el resultado queda en <code>ultima_entrega</code> de{" "}
        <code>GET /v1/webhooks</code>.
      </p>

      <h2 id="ajustes">Ajustes por sobrepeso</h2>
      <p>
        Si la paquetería verifica más peso del declarado, Myllos recalcula el flete con el nuevo peso cobrado, descuenta la diferencia del saldo y avisa por{" "}
        <code>envio.ajuste</code>. El ajuste también queda en <code>ajustes</code> de la guía. En sandbox lo provocas así:
      </p>
      <Codigo codigo={CURL_AJUSTE} />
      <Codigo codigo={AVISO_AJUSTE} titulo="POST a tu URL · envio.ajuste" />
      <Aviso titulo="Saldo negativo">
        Un ajuste puede dejar el saldo por debajo de cero. Mientras esté así, generar guías responde <code>402 saldo_insuficiente</code>.
      </Aviso>

      <h2 id="errores">Códigos de error</h2>
      <p>
        Todos los errores tienen la misma forma. Programa contra <code>codigo</code>, que no cambia; <code>mensaje</code> es para personas.
      </p>
      <Codigo codigo={ERROR_EJEMPLO} titulo="402 Payment Required" />
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>codigo</th>
            <th>Cuándo</th>
          </tr>
        </thead>
        <tbody>
          {ERRORES.map(([status, codigo, cuando]) => (
            <tr key={codigo}>
              <td>{status}</td>
              <td>
                <code>{codigo}</code>
              </td>
              <td>{cuando}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
