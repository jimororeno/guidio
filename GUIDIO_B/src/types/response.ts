export interface ApiResponse<T> {
  code: string;        // "000" si todo bien, o código de error
  message: string;     // Mensaje descriptivo
  data: T | null;      // El contenido (objeto, array, etc.)
}
