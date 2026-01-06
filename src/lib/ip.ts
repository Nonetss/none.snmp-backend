import * as ipaddr from 'ipaddr.js';

export function getAllIps(cidr: string): string[] {
  try {
    const network = ipaddr.parseCIDR(cidr);
    const start = network[0].toByteArray();
    const mask = network[1];

    const ips: string[] = [];
    const numIps = Math.pow(2, 32 - mask);

    let startInt =
      (start[0] << 24) | (start[1] << 16) | (start[2] << 8) | start[3];

    for (let i = 1; i < numIps - 1; i++) {
      const currentInt = startInt + i;
      const ip = [
        (currentInt >>> 24) & 0xff,
        (currentInt >>> 16) & 0xff,
        (currentInt >>> 8) & 0xff,
        currentInt & 0xff,
      ].join('.');
      ips.push(ip);
    }
    return ips;
  } catch (e) {
    return [];
  }
}
