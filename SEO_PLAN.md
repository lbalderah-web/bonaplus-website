# Bonaplus: plan de crecimiento orgánico

Actualizado: 2026-09-18. Leer junto con `SITE_MANAGEMENT.md` y `GROWTH_LOG.md`.

## Objetivo y límites de medición

Conseguir solicitudes mayoristas relevantes en República Dominicana y facilitar que el comprador pase de una búsqueda a un pedido claro. La web oficial ya está indexada. Una consulta pública de búsqueda es una observación puntual, no una medición de posición, tráfico o ventas.

En esta revisión no hay acceso a Google Search Console ni a analítica propia. No hay una línea base cuantitativa de impresiones, clics, consultas o conversiones. No atribuir crecimiento a un cambio sin datos. No instalar identificadores inventados ni afirmar que se solicitó indexación en Search Console.

## Una intención principal por página

| Página | Intención que debe resolver | Información útil y acción |
| --- | --- | --- |
| `/` | Bonaplus y catálogo oficial | Identidad de marca, categorías y selección por cajas |
| `/empresa/` | Industria Plus B&G y relación con Bonaplus | Empresa, contacto y datos comerciales aprobados |
| `/mayoristas/` | Comprar Bonaplus al por mayor; proveedor para distribuidores | Comparar las 10 presentaciones, elegir tamaño y preparar cotización |
| `/productos-limpieza/` | Productos de limpieza al por mayor en República Dominicana | Cloro, lavaplatos, desinfectante y líquido para calzado, con tamaños y enlaces directos |
| `/productos-cuidado-personal/` | Cuidado personal al por mayor; shampoo y rinse | Comparar las dos líneas y sus presentaciones de 90 y 150 ml |
| `/guia-mayoristas/` | Cómo preparar un pedido Bonaplus | Selección, cajas, ubicación y coordinación de entrega |
| `/productos/cloro/` | Cloro Bonaplus 150 ml al por mayor | Presentación, consulta comercial y selección de cajas |
| `/productos/lavaplatos/` | Lavaplatos líquido Bonaplus 150 ml | Aclarar que es un producto líquido y facilitar el pedido |
| `/productos/desinfectante/` | Desinfectante Bonaplus 90 ml | Presentación y disponibilidad; sin inventar eficacia, ingredientes o certificaciones |
| `/productos/calzado/` | Líquido para calzado Bonaplus 90 ml | Presentación y cotización; no añadir materiales compatibles no confirmados |
| `/productos/rinse/` | Rinse Bonaplus 90 y 150 ml | Acceso independiente a cada presentación en el pedido |
| `/productos/shampoo/` | Shampoo Bonaplus 90 y 150 ml | Acceso independiente a cada presentación en el pedido |
| `/productos/vinagre/` | Vinagre Bonaplus 150 ml | Presentación y pedido; no inventar composición o usos certificados |
| `/productos/vainilla/` | Vainilla Bonaplus 90 ml | Presentación y pedido; no inventar composición o usos certificados |

No crear páginas por ciudad ni variaciones de palabras clave que repitan el mismo contenido. Ampliar primero una página existente cuando haya una necesidad concreta del comprador.

## Prioridades siguientes

1. Cuando esté disponible Search Console, registrar por página y consulta los últimos 28 días frente a los 28 anteriores: impresiones, clics, CTR y posición media, separando marca/no marca y República Dominicana. Guardar fecha, filtros y tamaño de muestra. Permitir un nuevo rastreo antes de juzgar esta revisión.
2. Elegir una mejora a partir de esa evidencia: páginas con impresiones relevantes y pocos clics, consultas que la página no responde, o una oportunidad comercial respaldada por datos. No cambiar títulos todos los días ni interpretar una sola búsqueda como tendencia.
3. Mantener un registro separado de clics a WhatsApp y solicitudes recibidas cuando exista medición autorizada. Un clic no demuestra una conversación, un comprador cualificado ni una venta. No transmitir nombres, teléfonos ni textos del pedido a analítica.
4. Sustituir la imagen de desinfectante solo cuando exista una fuente de mayor resolución aprobada por el propietario. La fuente actual es pequeña; no inventar detalles de etiqueta ni especificaciones mediante generación de imágenes.
5. Incorporar dudas reales de compradores o datos de presentación confirmados por el propietario. Priorizar información comercial concreta sobre párrafos repetitivos. Mantener precios privados y las 400 cajas como referencia habitual, no mínimo obligatorio.
6. Si aparece una oportunidad de ficha empresarial o directorio externo, preparar la propuesta para el propietario. No crear cuentas, contactar terceros, comprar enlaces ni publicar datos nuevos sin autorización.

## Revisión técnica y publicación

- Usar el último `main` y comprobar trabajo concurrente antes de editar. Preservar el logo original, el wordmark sin + añadido y todas las imágenes completas.
- Comprobar producción y rutas afectadas. Las URLs principales usan HTTPS, `www` y barra final; las rutas `index.html` redirigen a su URL canónica. Conservar los parámetros del pedido al redirigir.
- Mantener las 14 URLs públicas en sitemap; actualizar `lastmod` solo tras cambios sustanciales reales. No añadir URLs de filtros, selección, pruebas ni documentos internos.
- Validar título y descripción únicos, un H1 principal, canonical propio, enlaces y anclas locales, JSON-LD legible y coherencia entre el contenido visible y los datos estructurados.
- Verificar que los metadatos de imágenes coincidan con el archivo real. Mantener imágenes descriptivas, dimensiones reservadas y carga diferida fuera de la vista inicial.
- `Product` describe productos de cotización privada. No añadir `Offer`, precios ficticios, disponibilidad no confirmada, reseñas ni valoraciones para obtener resultados enriquecidos. La validez semántica no garantiza elegibilidad ni aparición de resultados enriquecidos. Tampoco prometer resultados FAQ para esta web comercial.
- Ante cambios visuales, revisar móvil y escritorio; ante cambios del pedido, verificar cantidades, selección y resumen sin enviar mensajes reales.
- Publicar solo mejoras verificadas, confirmar el despliegue de producción y registrar evidencia y límites en `GROWTH_LOG.md`. Si no hay un cambio útil, informar del estado sin modificar código por rutina.

## Referencias primarias

- [Estructura de sitios de comercio electrónico — Google](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure)
- [Consolidación de URLs duplicadas — Google](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Datos estructurados de productos — Google](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)
- [Configuración de rutas y redirecciones — Vercel](https://vercel.com/docs/project-configuration/vercel-json)
