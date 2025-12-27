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
      timeout: 5000,
    };

    const session = snmp.createV3Session(config.ip, user, options);

    session.get(oids, (error, varbinds) => {
      if (error) {
        reject(error);
      } else if (varbinds) {
        resolve(varbinds);
      } else {
        reject(new Error('No varbinds returned'));
      }
      session.close();
    });
  });
}
