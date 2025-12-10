// types/api.ts

/**
 * Generic response wrapper returned by the backend.
 * All API responses come in this format.
 *
 * Example:
 * {
 *   code: 200,
 *   error: false,
 *   message: "OK",
 *   technicalMessage: undefined,
 *   data: {...}
 * }
 */
export interface MensajeApi<T = unknown> {
    code: number;             // Numeric code (similar to HTTP status)
    error: boolean;           // Whether the request failed
    message: string;          // User-friendly message
    technicalMessage?: string;// Extra dev/debug message from backend
    data?: T;                 // Generic payload (can be any type)
  }
  