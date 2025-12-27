import * as snmp from 'net-snmp';

export interface SNMPv2cConfig {
  ip: string;
  port: number;
  community: string;
}

export async function getSNMPv2c(
  config: SNMPv2cConfig,
  oids: string[],
): Promise<snmp.Varbind[]> {
  return new Promise((resolve, reject) => {
    const options: snmp.SessionOptions = {
      port: config.port,
      version: snmp.Version2c,
      retries: 1,
      timeout: 5000,
    };

    const session = snmp.createSession(config.ip, config.community, options);

    session.get(oids, (error, varbinds) => {
      session.close();
      if (error) {
        reject(error);
      } else if (!varbinds) {
        reject(new Error('No varbinds returned from SNMP session'));
      } else {
        resolve(varbinds);
      }
    });
  });
}
