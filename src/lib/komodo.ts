import { KomodoClient } from 'komodo_client';
import { db } from '@/core/config';
import { komodoAuthTable } from '@/db';

export async function getKomodoClient() {
  const [auth] = await db.select().from(komodoAuthTable).limit(1);

  if (!auth) {
    throw new Error('Komodo credentials not found in database');
  }

  return KomodoClient(auth.url, {
    type: 'api-key',
    params: {
      key: auth.key,
      secret: auth.secret,
    },
  });
}
