import { expect, test, describe } from 'bun:test';
import { pingHost } from '@/lib/icmp';
import { walkSNMP, formatVarbinds } from '@/lib/snmp/index';

// Configuración basada en tu src/prueba.ts
const TARGET_IP = '10.10.1.40';
const ROOT_OID = '1.3.6.1.2.1.1'; // System group

const mockDbConfig: any = {
  version: 'v3',
  port: 161,
  v3User: process.env.SNMP_V3_USER,
  v3Level: 'authPriv',
  v3AuthProtocol: 'sha',
  v3AuthKey: process.env.SNMP_V3_AUTH_KEY,
  v3PrivProtocol: 'aes',
  v3PrivKey: process.env.SNMP_V3_PRIV_KEY,
};

describe(`Integration Tests against ${TARGET_IP}`, () => {
  test('Debería responder al ping', async () => {
    const res = await pingHost(TARGET_IP);
    console.log(`[PING] Alive: ${res.alive}, Time: ${res.time}ms`);
    expect(res.alive).toBe(true);
  });

  test('Debería responder a walk SNMP v3', async () => {
    try {
      const varbinds = await walkSNMP(TARGET_IP, mockDbConfig, ROOT_OID);
      console.log(`[SNMP WALK] Respuestas recibidas: ${varbinds.length}`);

      const formatted = formatVarbinds(varbinds);
      formatted.slice(0, 5).forEach((v) => {
        console.log(`  OID: ${v.oid}, Value: ${v.value}`);
      });

      expect(varbinds.length).toBeGreaterThan(0);
    } catch (error) {
      console.error('[SNMP Error]', error);
      throw error;
    }
  }, 10000); // Timeout extendido para red
});
