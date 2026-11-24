# Proyecto-Plataforma-Conciencia-Climatica

## Dependencias para intallar langgrapg y utilizar los modelos de Google Gemini

- npm install @langchain/langgraph @langchain/core @langchain/google-genai

## Estructura de carpetas para el agente

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


