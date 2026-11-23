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

