import * as snmp from 'net-snmp';

export interface SNMPv1Config {
  ip: string;
  port: number;
  community: string;
}

export async function getSNMPv1(
  config: SNMPv1Config,
  oids: string[],
): Promise<snmp.Varbind[]> {
  return new Promise((resolve, reject) => {
    const options: snmp.SessionOptions = {
      port: config.port,
      version: snmp.Version1,
      retries: 1,
      timeout: 5000,
    };

    const session = snmp.createSession(config.ip, config.community, options);

    session.get(oids, (error, varbinds) => {
      if (error) {
        reject(error);
      } else if (varbinds) {
        resolve(varbinds);
      } else {
        reject(new Error('SNMP get returned no varbinds'));
      }
      session.close();
    });
  });
}
