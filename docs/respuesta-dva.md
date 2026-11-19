# Respuesta a la solicitud de integración

**DVA Response AI™ × Myllos Logística**

| | |
| --- | --- |
| **Para** | Iván Torres, DVAWeb · DVA Response AI™ |
| **De** | Ing. Raúl Valenzuela, Director General, Myllos Logística |
| **Fecha** | 19 de noviembre de 2026 |
| **Referencia** | Solicitud de integración del 11 de noviembre de 2026 |

Estimado Iván:

Gracias por considerar a Myllos como proveedor de envíos de DVA Response AI. El flujo que describen se opera con nuestra API de integraciones: un solo punto de conexión para cotizar, generar la guía, obtener la etiqueta y consultar el rastreo, sin que DVA tenga que elegir paquetería ni conectarse a varios sistemas.

El ambiente de pruebas ya está disponible. Respondemos cada punto en el orden de su carta; las respuestas técnicas remiten al sitio de documentación de integraciones, donde se pueden probar.

## El flujo de un envío

Así queda cada paso de su propuesta:

| # | Paso de DVA | En la API de Myllos |
| --- | --- | --- |
| 1 | El cliente final elige productos y da el CP de destino. | Sin llamada a Myllos. |
| 2 | La plataforma calcula peso real y volumétrico y toma el mayor. | Recomendamos enviar el peso real y las medidas de cada caja. Myllos aplica la fórmula y devuelve `peso.cobrado_kg`, así el precio que ve el cliente es el que se cobra. |
| 3 | Pide la cotización con CP de origen y destino. | `POST /v1/cotizaciones` |
| 4 | Muestra la opción más económica y la más rápida. | La respuesta trae Económico y Express ordenados por precio, con días hábiles y fecha estimada de entrega. |
| 5 | Con el pedido pagado, el negocio confirma peso y caja. | Se cotiza de nuevo con los datos finales. Con los mismos datos la tarifa no cambia; si el peso o la caja cambiaron, el precio se actualiza antes de comprar. |
| 6 | La plataforma compra la guía y entrega la etiqueta. | `POST /v1/guias` con `Idempotency-Key`, y `GET /v1/guias/{id}/etiqueta` en PDF o ZPL. |
| 7 | Número de guía y rastreo quedan en el pedido. | La respuesta trae `numero_guia` y `rastreo_url`. Cada cambio llega por el webhook `envio.estado`. |

## Modelo comercial

Estamos de acuerdo con el esquema que proponen:

- DVA es cliente de Myllos, con una cuenta y una llave de integración. Myllos le factura a DVA y DVA le factura al negocio.
- El negocio es el remitente. La guía se emite con su nombre y la dirección de origen que DVA envía en cada guía, así que un negocio puede tener varios orígenes sin configurar nada en Myllos.
- DVA define su margen y el precio al negocio. La tarifa de Myllos a DVA solo la ve DVA.
- El prepago de los negocios en DVA encaja con el saldo de prepago de la cuenta de DVA en Myllos. Si el saldo no alcanza, la API rechaza la guía con `402 saldo_insuficiente` y no se emite nada a crédito.

### Ajustes posteriores

- **Cómo se determinan.** La paquetería verifica peso y medidas en su red. Si el peso cobrado verificado supera el de la guía, se recalcula el flete con la misma tarifa y se cobra la diferencia. La zona extendida no es un ajuste posterior: se identifica por el código postal de destino y ya viene en la cotización.
- **Cómo se notifican.** Con el webhook `envio.ajuste`, que trae peso anterior, peso verificado y monto. El ajuste también queda en la guía.
- **Cómo se cobran.** Se descuentan del saldo de prepago de DVA al registrarse. DVA puede trasladarlos al negocio con el detalle del aviso.
- **Plazo.** Se avisan en cuanto la paquetería reporta la verificación, normalmente dentro de los 7 días hábiles posteriores a la recolección.

## Información técnica

### 1. Documentación de la API

Está en el sitio de integraciones: la guía del sandbox (`/sandbox`) con el flujo completo y la referencia de la API (`/referencia`) con cada campo. Las cuatro operaciones que piden, y las que las complementan:

| Operación | Método | Ruta |
| --- | --- | --- |
| Cotizar | POST | `/v1/cotizaciones` |
| Generar guía | POST | `/v1/guias` |
| Obtener la etiqueta | GET | `/v1/guias/{id}/etiqueta` |
| Consultar el rastreo | GET | `/v1/rastreo/{numero}` |
| Cancelar con reembolso | DELETE | `/v1/guias/{id}` |
| Consultar saldo | GET | `/v1/saldo` |
| Registrar webhooks | POST | `/v1/webhooks` |

### 2. Ambiente de pruebas y credenciales

URL base `http://localhost:8095/v1` y llave `mk_test_sandbox`, con 5,000 MXN de saldo de prueba. El sandbox simula el avance del rastreo, el sobrepeso y la cancelación, y no recolecta ni cobra. La llave de producción, con prefijo `mk_live_`, se entrega al firmar.

### 3. Avisos automáticos

Sí. `envio.estado` avisa cada cambio de estado del envío y `envio.ajuste` cada cargo posterior, como sobrepeso. Cada aviso va firmado con HMAC-SHA256 para que DVA verifique que viene de Myllos. El detalle está en la sección Webhooks de la guía del sandbox (`/sandbox#webhooks`).

### 4. Formato de la etiqueta

PDF y ZPL, de 4 × 6 pulgadas (10 × 15 cm). El ZPL está a 203 dpi para impresoras térmicas Zebra. Se elige con `formato=pdf` o `formato=zpl`.

### 5. Fórmula de peso volumétrico

`(largo × ancho × alto) / 5000`, con medidas en centímetros y resultado en kilogramos. Por caja se cobra el mayor entre el peso real y el volumétrico, redondeado al kilogramo superior. Por ejemplo, una caja de 30 × 20 × 15 cm pesa 1.8 kg volumétricos; con 1.2 kg reales se cobran 2 kg.

## Información comercial

### 1. Condiciones para revendedores

No pedimos un mínimo de guías para arrancar. La tarifa mejora con el volumen:

| Envíos diarios promedio | Tarifa |
| --- | --- |
| Menos de 300 | Tarifa de lista |
| De 300 a 999 | 5% de descuento |
| 1,000 o más | 10% de descuento |

El promedio se mide con el mes calendario anterior y el descuento aplica al flete del mes siguiente.

### 2. Paqueterías y tipos de servicio

Dos servicios: **Económico**, terrestre, de 3 a 5 días hábiles, y **Express**, de 1 a 2 días hábiles. Myllos asigna la paquetería de su red según la ruta y el servicio. DVA recibe un solo número de guía y un solo rastreo, sin integrar cada paquetería.

### 3. Cobertura y zonas extendidas

Cobertura nacional. La zona extendida se identifica por el código postal de destino y aparece en la cotización como `zona_extendida: true`, con su cargo en el desglose. DVA la ve antes de comprar la guía, no como un cargo posterior.

### 4. Servicios adicionales

| Servicio | Costo, IVA incluido |
| --- | --- |
| Recolección en el domicilio de origen | $45 por guía |
| Seguro sobre el valor declarado | 2% del valor declarado, mínimo $25 |
| Acuse de recibo | $35 por guía |
| Zona extendida | $120 por guía |

Cada uno se pide en la cotización y viaja desglosado en el precio.

### 5. Cobro y plazo de los ajustes

Se descuentan del saldo de prepago al registrarse y se avisan por `envio.ajuste`, normalmente dentro de los 7 días hábiles posteriores a la recolección. Si un ajuste deja el saldo en negativo, no se emiten guías nuevas hasta cubrirlo.

### 6. Forma de pago y facturación

Prepago desde el arranque: DVA recarga su saldo y cada guía se descuenta al emitirse. Una vez que la operación alcance el volumen que acordemos en el contrato, podemos abrir una línea de crédito con base en el historial de los primeros meses. Facturamos con CFDI mensual a nombre de DVA, con el detalle de guías, cancelaciones y ajustes del periodo.

### 7. Vigencia, cancelación y reembolso

Una guía generada y no usada está vigente 30 días. Se cancela mientras no se haya recolectado, y el reembolso es íntegro al saldo: costo de la guía, adicionales y ajustes. Después de la recolección ya no se cancela.

### 8. Extravíos y daños

| Caso | Plazo para reclamar |
| --- | --- |
| Daño visible | 24 horas desde la entrega |
| Daño oculto | 7 días naturales desde la entrega |
| Extravío | 30 días naturales desde la emisión de la guía |

DVA levanta el reclamo con el número de guía, fotos del empaque y del contenido, y el comprobante del valor. Respondemos en 15 días hábiles. Con seguro, la indemnización llega hasta el valor declarado; sin seguro, aplica el límite de responsabilidad de la paquetería.

### 9. Contrato y términos

Aplican los [términos de la integración](#términos-de-la-integración) que aparecen al final de esta respuesta. Los formalizamos en un contrato de prestación de servicios con un anexo de integración. Para prepararlo necesitamos la constancia de situación fiscal de DVAWeb, el poder de quien firma y los datos de facturación.

## Volumen y condiciones

Con la proyección de 1,000 envíos diarios, DVA entra en la tarifa con 10% de descuento desde el mes siguiente a alcanzarla. Sobre lo que piden para ofrecer un precio competitivo:

- **Tarifas preferenciales por volumen:** la tabla de la sección comercial, medida cada mes.
- **Pago y crédito:** prepago desde el primer día y línea de crédito al alcanzar el volumen acordado.
- **Acompañamiento:** un canal técnico directo durante la integración, revisión conjunta de la integración en sandbox antes de pasar a producción, y seguimiento de las primeras guías y ajustes con los primeros negocios.

## Siguientes pasos

| # | Paso | Detalle | Estado |
| --- | --- | --- | --- |
| 1 | Llamada de 30 minutos | Proponemos agendarla esta semana, con alguien de producto y alguien técnico de cada lado. | Por agendar |
| 2 | Documentación y condiciones | La guía y la referencia de la API están en el sitio de integraciones; las condiciones, en este documento. | Listo |
| 3 | Integración de prueba | Sandbox disponible con la llave `mk_test_sandbox`. | Listo para empezar |
| 4 | Firma y puesta en marcha | Validada la integración en sandbox, firmamos y entregamos la llave de producción para los primeros negocios. | Después de la prueba |

Quedamos atentos para agendar la llamada.

Atentamente,

**Ing. Raúl Valenzuela**<br>
Director General, Myllos Logística

## Términos de la integración

- **Alcance.** Cotización, guías, etiquetas, rastreo, cancelación, saldo y webhooks en la versión `/v1` de la API.
- **Precio.** Se cobra la tarifa vigente al cotizar, con IVA incluido y el descuento por volumen que corresponda.
- **Pago.** Prepago. Sin saldo suficiente no se emite la guía.
- **Ajustes.** Se descuentan del saldo y se avisan por webhook.
- **Cancelación.** Hasta 30 días, mientras la guía no se haya recolectado, con reembolso íntegro al saldo.
- **Remitente.** El negocio declara contenido, peso y valor, y responde por su exactitud y por no enviar artículos prohibidos. DVA traslada esta obligación a los negocios de su plataforma.
- **Reclamos.** En los plazos de la tabla de extravíos y daños, con respuesta en 15 días hábiles.
- **Facturación.** CFDI mensual a nombre de DVA.
- **Llaves.** Son confidenciales. DVA responde por el uso de las llaves de su cuenta y avisa de inmediato si alguna se expone.
- **Cambios a la API.** Los cambios compatibles se publican en `/v1`. Los que rompen compatibilidad van a una versión nueva, con 90 días de aviso.

_Las condiciones comerciales de esta respuesta son la propuesta de Myllos para la integración y quedan sujetas a la firma del contrato._
