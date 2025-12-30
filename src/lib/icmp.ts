import ping, { pingResponse, pingOptions } from 'pingman';

export interface PingResult {
  alive: boolean;
  time: number | 'unknown';
}

export async function pingHost(ip: string, timeout = 2): Promise<PingResult> {
  const options: pingOptions = {
    timeout,
    numberOfEchos: 3,
    IPV4: true,
  };

  try {
    const res: pingResponse = await ping(ip, options);

    return {
      alive: res.alive ?? false,
      time: res.time ?? 'unknown',
    };
  } catch (error) {
    return {
      alive: false,
      time: 'unknown',
    };
  }
}
