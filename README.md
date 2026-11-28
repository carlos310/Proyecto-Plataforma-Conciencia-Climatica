# Proyecto-Plataforma-Conciencia-Climatica

## Dependencias para intallar langgrapg y utilizar los modelos de Google Gemini

- npm install @langchain/langgraph @langchain/core @langchain/google-genai

## Estructura de carpetas para el agente

```text
proyecto_aquanova/
├── frontend/                  # Aplicación web en Angular + Capacitor (Móvil)
├── backend/                   # API principal y lógica de negocio
│   └── agent/                 # Módulo del Agente Asesor de Compras (LangGraph)
│       ├── state.ts           # Definición del StateSchema (memoria, historial y estado de cotización)
│       ├── prompts.ts         # System prompts, tono del asesor y reglas técnicas de compatibilidad
│       ├── tools/             # Herramientas externas conectadas al agente
│       │   ├── postgres.ts    # Consultas SQL (catálogo de tanques, kits hidráulicos, precios y stock)
│       │   └── manuals.ts     # Búsqueda semántica (RAG) en fichas técnicas y manuales PDF
│       ├── nodes/             # Nodos de procesamiento del grafo
│       │   ├── advisor.ts     # Nodo principal que invoca al LLM y decide el uso de herramientas
│       │   └── validator.ts   # Validación de compatibilidad técnica y disponibilidad antes de cotizar
│       ├── edges.ts           # Enrutamiento condicional entre nodos y ejecución de herramientas
│       └── graph.ts           # Ensamblaje, compilación (.compile()) y exportación del grafo
├── database/                  # Scripts SQL de estructura y datos iniciales (PostgreSQL)
└── docker-compose.yml         # Orquestación de contenedores (Frontend, Backend/Agente, DB)

## Documentación de referencia
- https://docs.langchain.com/oss/javascript/langgraph/quickstart
- https://www.xjavascript.com/blog/langgraph-typescript/
- https://dev.to/fabrikapp/how-to-implement-a-langchain-langgraph-in-typescript-in-5-minutes-21mh
agent/
├── state.ts # Definición del StateSchema (memoria y variables de lod productos)
├── prompts.ts # Instrucciones del sistema (reglas de negocio, tono del asesor)
├── tools/ # Herramientas externas que usa el agente
│ ├── postgres.ts # Consultas SQL (buscar tanques, kits hidráulicos, precios, stock)
│ └── manuals.ts # Búsqueda RAG en los PDFs técnicos (Pavco, soldaduras PVC/CPVC)
├── nodes/ # Funciones de cada paso del grafo
│ ├── advisor.ts # Nodo principal que llama al LLM con el historial y decide acciones
│ └── validator.ts # Nodo opcional para validar compatibilidad técnica o stock antes de cotizar
├── edges.ts # Funciones de enrutamiento condicional (deciden hacia qué nodo saltar)
└── graph.ts # Une todo: importa nodos, edges y estado, hace .compile() y exporta el grafo

# En la base de datos

Es importante cambiar la tabla de productos en PostgreSQL, se pueden utilizar distintos métodos

1.  Utilizar una tabla intermedia stg.producto

        1.1. Quitar todas las relaciones de pruebas que se hayan podido hacer con la tabla de productos.

            `TRUNCATE TABLE nombreTabla RESTART IDENTITY CASCADE;`

        1.2  Utilizar este bloque de código

            ```sql

                -- 1) Alterar la tabla: solo agregar y ampliar, no se pierde nada

                    ALTER TABLE aqua_nova.productos
                    ADD COLUMN IF NOT EXISTS prod_codigo varchar(20) UNIQUE,
                    ADD COLUMN IF NOT EXISTS prod_material varchar(150),
                    ADD COLUMN IF NOT EXISTS prod_medidas text,
                    ADD COLUMN IF NOT EXISTS prod_activo boolean NOT NULL DEFAULT true;

                    ALTER TABLE aqua_nova.productos
                    ALTER COLUMN prod_nombre TYPE varchar(150),
                    ALTER COLUMN prod_descripcion TYPE text,
                    ALTER COLUMN prod_categoria TYPE varchar(60);

                -- 2) Tabla de paso (staging) para recibir el CSV tal cual
                CREATE TABLE aqua_nova.stg_productos (
                referencia text, category text, name text, description text, measure text,
                material text, sellvalue numeric, buyvalue numeric, stock integer, providerid integer
                );

                -- 3) Cargar el archivo (todo en una sola línea; en Windows usa barras /)
                \copy aqua_nova.stg_productos FROM 'C:/ruta/Productos_Catalogo_limpio.csv' WITH (FORMAT csv, HEADER true, DELIMITER ';', QUOTE '"', ENCODING 'UTF8');

                -- 4) Pasar a la tabla real
                INSERT INTO aqua_nova.productos
                (prod_codigo, prod_categoria, prod_nombre, prod_descripcion, prod_medidas,
                prod_material, prod_precio_venta, prod_precio_compra, prod_stock, prov_id)
                SELECT referencia, category, name, description, measure,
                material, sellvalue, buyvalue, stock::text, providerid
                FROM aqua_nova.stg_productos;  
            ```

            1.3 DROP a la tabla de Staging

2. Eliminar y crear de nuevo la tabla de productos

   2.1 Eliminar la tabla Productos

   2.2 Crear el archivo utilizando un Copy para traer la información

## Cambios en la infraestructura de la aplicación

Apartir de este punto se debe estructurar las nuevas variables dentro de la entidad para que TypeORM lo interprete, adaptadores y controladores.


