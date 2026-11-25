import { modeloPort } from "../../domain/agentePort.js";

export function graph(deps: { modelo: modeloPort }) {
  return {
    async invoke(entrada: { mensaje: string }) {
      return { respuesta: { resumen: "respuesta de prueba", recomendaciones: [] } };
    },
  };
}

export type Grafo = ReturnType<typeof graph>;