import { Handler } from 'hono';
import axios from 'axios';
import { db } from '@/core/config';
import { pangolinAuthTable, pangolinOrgTable } from '@/db';
import { eq } from 'drizzle-orm';

export const pangolinGetHandler: Handler = async (c) => {
  try {
    const [auth] = await db.select().from(pangolinAuthTable).limit(1);

    if (!auth) {
      return c.json(
        { error: 'Pangolin credentials not found in database' },
        404,
      );
    }

    const [org] = await db
      .select()
      .from(pangolinOrgTable)
      .where(eq(pangolinOrgTable.authId, auth.id))
      .limit(1);

    if (!org) {
      return c.json(
        { error: 'Pangolin organization not found in database' },
        404,
      );
    }

    const { url, token } = auth;
    const orgSlug = org.slug;

    // Crear cliente Axios para Pangolin
    const pangolin = axios.create({
      baseURL: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await pangolin.get(`/v1/org/${orgSlug}/resources`);
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
