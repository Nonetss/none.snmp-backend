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
      session.close();
      if (error) {
        reject(error);
      } else if (varbinds) {
        resolve(varbinds);
      } else {
        reject(new Error('No varbinds returned'));
      }
    });
  });
}

export async function walkSNMPv1(
  config: SNMPv1Config,
  rootOid: string,
): Promise<snmp.Varbind[]> {
  return new Promise((resolve, reject) => {
    const options: snmp.SessionOptions = {
      port: config.port,
      version: snmp.Version1,
      retries: 1,
      timeout: 5000,
    };

    const session = snmp.createSession(config.ip, config.community, options);
    const result: snmp.Varbind[] = [];

    session.walk(
      rootOid,
      (varbinds) => {
        for (const vb of varbinds) {
          if (snmp.isVarbindError(vb)) {
            console.error(snmp.varbindError(vb));
          } else {
            result.push(vb);
          }
        }
      },
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
        session.close();
      },
    );
  });
}
