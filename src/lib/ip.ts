import * as ipaddr from 'ipaddr.js';
import { logger } from '@/lib/logger';

export function getAllIps(cidr: string): string[] {
  try {
    const [range, mask] = ipaddr.parseCIDR(cidr);
    const numIps = Math.pow(2, 32 - mask);

    // Use Uint32Array to avoid signed integer issues with bitwise operations
    const startOctets = range.toByteArray();
    const startInt =
      ((startOctets[0] << 24) >>> 0) |
      (startOctets[1] << 16) |
      (startOctets[2] << 8) |
      startOctets[3];

    const ips: string[] = [];

    if (mask === 32) {
      return [range.toString()];
    }

    if (mask === 31) {
      ips.push(intToIp(startInt));
      ips.push(intToIp(startInt + 1));
      return ips;
    }

    // For other masks, typically exclude network and broadcast
    for (let i = 1; i < numIps - 1; i++) {
      ips.push(intToIp(startInt + i));
    }
    return ips;
  } catch (e) {
    logger.error({ e }, `Error parsing CIDR ${cidr}`);
    return [];
  }
}

function intToIp(int: number): string {
  return [
    (int >>> 24) & 0xff,
    (int >>> 16) & 0xff,
    (int >>> 8) & 0xff,
    int & 0xff,
  ].join('.');
}
