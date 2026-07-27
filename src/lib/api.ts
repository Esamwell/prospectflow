/**
 * URL base da API do backend.
 * Em desenvolvimento: usa http://localhost:4000.
 * Na Vercel (deploy único): deixe vazio para usar a mesma origem (/api/*).
 */
export const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.trim() ||
  (import.meta.env.DEV ? 'http://localhost:4000' : 'https://prospectflow-backend-0ydl.onrender.com');
