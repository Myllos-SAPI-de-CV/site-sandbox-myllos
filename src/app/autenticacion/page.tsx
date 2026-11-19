import type { Metadata } from "next";
import { Codigo } from "@/components/Codigo";
import { BASE_URL, LLAVE_PRUEBA } from "@/lib/config";

export const metadata: Metadata = { title: "Autenticación" };

const ERROR_401 = `{
  "codigo": "llave_invalida",
  "mensaje": "La llave no existe o fue revocada."
}`;

export default function Autenticacion() {
  return (
    <article className="doc">
      <h1>Autenticación</h1>
      <p className="lead">
        Cada petición lleva una llave en el encabezado <code>Authorization</code>. La única excepción es <code>GET /v1/estado</code>, que sirve para comprobar
        que el ambiente está arriba.
      </p>

      <Codigo codigo={`curl ${BASE_URL}/saldo \\\n  -H "Authorization: Bearer ${LLAVE_PRUEBA}"`} />

      <h2 id="llaves">Llaves</h2>
      <p>
        Cada llave es una cuenta: su saldo, sus guías y sus webhooks no se mezclan con los de otra llave. Una guía creada con una llave no se puede consultar con
        otra.
      </p>
      <table>
        <thead>
          <tr>
            <th>Ambiente</th>
            <th>Prefijo</th>
            <th>Uso</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sandbox</td>
            <td>
              <code>mk_test_</code>
            </td>
            <td>Pruebas de integración con saldo ficticio de 5,000 MXN. Las guías no se recolectan.</td>
          </tr>
          <tr>
            <td>Producción</td>
            <td>
              <code>mk_live_</code>
            </td>
            <td>Se entrega al firmar el acuerdo. Mismo contrato de API, otra URL base y saldo real.</td>
          </tr>
        </tbody>
      </table>
      <p>
        La llave de prueba de este sandbox es <code>{LLAVE_PRUEBA}</code>.
      </p>

      <h2 id="errores">Errores de autenticación</h2>
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>codigo</th>
            <th>Cuándo ocurre</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>401</td>
            <td>
              <code>no_autorizado</code>
            </td>
            <td>
              Falta el encabezado o no usa el esquema <code>Bearer</code>.
            </td>
          </tr>
          <tr>
            <td>401</td>
            <td>
              <code>llave_invalida</code>
            </td>
            <td>La llave no existe o fue revocada.</td>
          </tr>
        </tbody>
      </table>
      <Codigo codigo={ERROR_401} titulo="401 Unauthorized" />

      <h2 id="cuidado">Cuidado de la llave</h2>
      <ul>
        <li>Úsala solo desde tu servidor. No la pongas en el navegador, en una app móvil ni en mensajes de WhatsApp.</li>
        <li>Si se expone, pide una llave nueva y revocamos la anterior.</li>
        <li>Usa una llave por ambiente. La de sandbox no funciona en producción, ni al revés.</li>
      </ul>
    </article>
  );
}
