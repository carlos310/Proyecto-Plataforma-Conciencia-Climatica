// src/infrastructure/adapter/consultasAdapter.ts
// Consultas usadas por las pantallas de crear, editar, consultar y borrar registros.
// Casi todas las rutas del backend exigen el token de sesión, así que cada petición lo envía automáticamente.
const BASE_URL = "http://localhost:4000/api";

// Token guardado al iniciar sesión (ver authService.login). Si no hay sesión, no se envía cabecera.
function cabecerasSesion(): Record<string, string> {
  try {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

export async function obtenerPorId<T>(ruta: string, id: number, headers: HeadersInit = {}): Promise<T | null> {
  const res = await fetch(`${BASE_URL}/${ruta}/id/${id}`, { headers: { ...cabecerasSesion(), ...(headers as Record<string, string>) } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Error consultando registro");
  return res.json();
}

export async function obtenerTodos<T>(ruta: string, headers: Record<string, string> = {}): Promise<T[]> {
  const res = await fetch(`${BASE_URL}/${ruta}`, { headers: { ...cabecerasSesion(), ...headers } });
  if (!res.ok) throw new Error("Error consultando registros");
  return res.json();
}

// PUT para actualizar un registro. El backend responde con el motivo del error (Joi) en details o error
export async function actualizarRegistro(ruta: string, id: number, datos: object, headers: Record<string, string> = {}): Promise<void> {
  const res = await fetch(`${BASE_URL}/${ruta}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...cabecerasSesion(), ...headers },
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    const cuerpo: { error?: string; details?: string } = await res.json().catch(() => ({}));
    throw new Error(cuerpo.details ?? cuerpo.error ?? "Error actualizando el registro");
  }
}

// POST para crear un registro nuevo
export async function crearRegistro(ruta: string, datos: object, headers: Record<string, string> = {}): Promise<void> {
  const res = await fetch(`${BASE_URL}/${ruta}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...cabecerasSesion(), ...headers },
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    const cuerpo: { error?: string; details?: string } = await res.json().catch(() => ({}));
    throw new Error(cuerpo.details ?? cuerpo.error ?? "Error creando el registro");
  }
}

// DELETE para borrar un registro por ID
export async function eliminarRegistro(ruta: string, id: number, headers: Record<string, string> = {}): Promise<void> {
  const res = await fetch(`${BASE_URL}/${ruta}/${id}`, { method: "DELETE", headers: { ...cabecerasSesion(), ...headers } });
  if (!res.ok) {
    const cuerpo: { error?: string; details?: string } = await res.json().catch(() => ({}));
    throw new Error(cuerpo.details ?? cuerpo.error ?? "Error borrando el registro");
  }
}

// El input type="date" necesita formato YYYY-MM-DD
export function fechaISO(fecha: Date | string): string {
  return String(fecha).slice(0, 10);
}
