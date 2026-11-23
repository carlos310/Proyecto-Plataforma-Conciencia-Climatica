# Proyecto-Plataforma-Conciencia-Climatica

## Dependencias para intallar langgrapg y utilizar los modelos de Google Gemini

- npm install @langchain/langgraph @langchain/core @langchain/google-genai

## Estructura de carpetas para el agente

agent/
├── state.ts          # Definición del StateSchema (memoria y variables de lod productos)
├── prompts.ts        # Instrucciones del sistema (reglas de negocio, tono del asesor)
├── tools/            # Herramientas externas que usa el agente
│   ├── postgres.ts   # Consultas SQL (buscar tanques, kits     hidráulicos, precios, stock)
│   └── manuals.ts    # Búsqueda RAG en los PDFs técnicos (Pavco, soldaduras PVC/CPVC)
├── nodes/            # Funciones de cada paso del grafo
│   ├── advisor.ts    # Nodo principal que llama al LLM con el historial y decide acciones
│   └── validator.ts  # Nodo opcional para validar compatibilidad técnica o stock antes de cotizar
├── edges.ts          # Funciones de enrutamiento condicional (deciden hacia qué nodo saltar)
└── graph.ts          # Une todo: importa nodos, edges y estado, hace .compile() y exporta el grafo

