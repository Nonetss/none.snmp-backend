import * as snmp from 'net-snmp';

export interface SNMPv1Config {
  ip: string;
  port: number;
  community: string;
}

export async function getSNMPv1(
  config: SNMPv1Config,
  oids: string[],
  timeout: number = 5000,
): Promise<snmp.Varbind[]> {
  return new Promise((resolve, reject) => {
    const options: snmp.SessionOptions = {
      port: config.port,
      version: snmp.Version1,
      retries: 1,
      timeout: timeout,
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
  timeout: number = 5000,
): Promise<snmp.Varbind[]> {
  return new Promise((resolve, reject) => {
    const options: snmp.SessionOptions = {
      port: config.port,
      version: snmp.Version1,
      retries: 1,
      timeout: timeout,
    };

    const session = snmp.createSession(config.ip, config.community, options);
    const result: snmp.Varbind[] = [];

    function walk(currentOid: string) {
      session.getNext([currentOid], (error, varbinds) => {
        if (error) {
          reject(error);
          session.close();
          return;
        }

        const vb = varbinds[0];
        if (snmp.isVarbindError(vb)) {
          resolve(result);
          session.close();
          return;
        }

        // Check if we are still in the subtree
        if (vb.oid === rootOid || vb.oid.startsWith(rootOid + '.')) {
          result.push(vb);
          walk(vb.oid); // Next one
        } else {
          resolve(result);
          session.close();
        }
      });
    }

    walk(rootOid);
  });
}
