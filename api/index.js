/**
 * Handler serverless da Vercel: encaminha todas as requisições /api/* para a app Express do backend.
 */
import app from '../backend/src/app.js';

export default function handler(req, res) {
  return app(req, res);
}
