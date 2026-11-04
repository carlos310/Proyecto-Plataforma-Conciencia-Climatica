// src/infrastructure/adapter/authService.ts
export async function login(email: string, password : string) {
  const res = await fetch("http://localhost:4000/api/usuarios/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password  })
  });
  if (!res.ok) throw new Error("Error en login");
  const data = await res.json();
  localStorage.setItem("token", data.token);
}

// Lee el payload del token guardado (el servidor sigue validando la firma en cada petición)
export function leerSesion(): { id: number; email: string; rol: string } | null {
  try {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return null;
    const partes = token.split(".");
    if (partes.length !== 3) return null;
    const payload = JSON.parse(atob(partes[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function hasSession(): boolean {
  return leerSesion() !== null;
}

export function getRol(): string | null {
  return leerSesion()?.rol?.trim().toLowerCase() ?? null;
}

export function logout(): void {
  localStorage.removeItem("token");
}

export async function getMe() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:4000/api/usuarios/me", {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Error obteniendo usuario");
  return res.json();
}
