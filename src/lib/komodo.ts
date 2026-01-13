import { KomodoClient, Types } from 'komodo_client';

const KOMODO_KEY = process.env.KOMODO_KEY || '';
const KOMODO_SECRET = process.env.KOMODO_SECRET || '';
const KOMODO_URL = process.env.KOMODO_URL || '';

export const komodo = KomodoClient(KOMODO_URL, {
  type: 'api-key',
  params: {
    key: KOMODO_KEY,
    secret: KOMODO_SECRET,
  },
});
