import * as snmp from 'net-snmp';

export interface SNMPv3Config {
  ip: string;
  port: number;
  user: string;
  level: 'noAuthNoPriv' | 'authNoPriv' | 'authPriv';
  authProtocol: 'md5' | 'sha';
  authKey: string;
  privProtocol: 'aes' | 'des';
  privKey: string;
}

export async function getSNMPv3(
  config: SNMPv3Config,
  oids: string[],
  timeout: number = 5000,
): Promise<snmp.Varbind[]> {
  return new Promise((resolve, reject) => {
    const user: snmp.User = {
      name: config.user,
      level:
        config.level === 'authPriv'
          ? snmp.SecurityLevel.authPriv
          : config.level === 'authNoPriv'
            ? snmp.SecurityLevel.authNoPriv
            : snmp.SecurityLevel.noAuthNoPriv,
      authProtocol:
        config.authProtocol === 'sha'
          ? snmp.AuthProtocols.sha
          : snmp.AuthProtocols.md5,
      authKey: config.authKey,
      privProtocol:
        config.privProtocol === 'aes'
          ? snmp.PrivProtocols.aes
          : snmp.PrivProtocols.des,
      privKey: config.privKey,
    };

    const options: snmp.SessionOptionsV3 = {
      port: config.port,
      version: snmp.Version3,
      retries: 1,
      timeout: timeout,
    };

    const session = snmp.createV3Session(config.ip, user, options);

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

export async function walkSNMPv3(
  config: SNMPv3Config,
  rootOid: string,
  timeout: number = 5000,
): Promise<snmp.Varbind[]> {
  return new Promise((resolve, reject) => {
    const user: snmp.User = {
      name: config.user,
      level:
        config.level === 'authPriv'
          ? snmp.SecurityLevel.authPriv
          : config.level === 'authNoPriv'
            ? snmp.SecurityLevel.authNoPriv
            : snmp.SecurityLevel.noAuthNoPriv,
      authProtocol:
        config.authProtocol === 'sha'
          ? snmp.AuthProtocols.sha
          : snmp.AuthProtocols.md5,
      authKey: config.authKey,
      privProtocol:
        config.privProtocol === 'aes'
          ? snmp.PrivProtocols.aes
          : snmp.PrivProtocols.des,
      privKey: config.privKey,
    };

    const options: snmp.SessionOptionsV3 = {
      port: config.port,
      version: snmp.Version3,
      retries: 1,
      timeout: timeout,
    };

    const session = snmp.createV3Session(config.ip, user, options);
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
