import { Handler } from 'hono';
import axios from 'axios';

// Configuración de Pangolin desde variables de entorno
const PANGOLIN_URL = process.env.PANGOLIN_URL || '';
const PANGOLIN_KEY = process.env.PANGOLIN_KEY || '';
const PANGOLIN_ORG = process.env.PANGOLIN_ORG || '';

// Crear cliente Axios para Pangolin
const pangolin = axios.create({
  baseURL: PANGOLIN_URL,
  headers: {
    Authorization: `Bearer ${PANGOLIN_KEY}`,
  },
});

export const pangolinGetHandler: Handler = async (c) => {
  try {
    // Intentamos con /api/resources asumiendo que v1 puede ser incorrecto
    const response = await pangolin.get(`/v1/org/${PANGOLIN_ORG}/resources`);
    return c.json(response.data.data.resources);
  } catch (error: any) {
    console.error('Error al obtener recursos de Pangolin:', error.message);

    if (error.response) {
      // Devolvemos el error original del servicio Pangolin
      return c.json(error.response.data, error.response.status);
    }

    return c.json({ error: 'Error al obtener recursos de Pangolin' }, 500);
  }
};
