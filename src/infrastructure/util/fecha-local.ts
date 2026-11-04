// Joi convierte "YYYY-MM-DD" a Date en UTC (medianoche UTC). Al guardarlo en una columna date,
// pg lo escribe en hora local y el día se corre. Esta función devuelve la medianoche LOCAL del mismo día.
export function fechaLocal(fecha: Date): Date {
  return new Date(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate());
}
