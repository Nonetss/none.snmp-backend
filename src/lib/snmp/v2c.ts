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
      } else if (varbinds) {
        resolve(varbinds);
      } else {
        reject(new Error('No varbinds returned'));
      }
    });
  });
}

export async function walkSNMPv2c(
  config: SNMPv2cConfig,
  rootOid: string,
): Promise<snmp.Varbind[]> {
  return new Promise((resolve, reject) => {
    const options: snmp.SessionOptions = {
      port: config.port,
      version: snmp.Version2c,
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
            // Ensure strict subtree matching (handling dot boundaries)
            if (vb.oid === rootOid || vb.oid.startsWith(rootOid + '.')) {
              result.push(vb);
            }
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
