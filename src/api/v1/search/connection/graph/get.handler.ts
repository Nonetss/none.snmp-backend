import { db } from '@/core/config';
import {
  deviceTable,
  lldpNeighborTable,
  systemTable,
  interfaceTable,
} from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getSwitchConnectionsRoute } from './get.route';

export const getSwitchConnectionsHandler: RouteHandler<
  typeof getSwitchConnectionsRoute
> = async (c) => {
  const { format } = c.req.valid('query');

  try {
    // 1. Obtener todos los vecinos LLDP conocidos
    const neighbors = await db
      .select({
        sourceId: deviceTable.id,
        sourceName: systemTable.sysName,
        sourceIp: deviceTable.ipv4,
        localPortNum: lldpNeighborTable.localPortNum,
        neighborSysName: lldpNeighborTable.sysName,
        neighborPortId: lldpNeighborTable.portId,
        neighborPortDesc: lldpNeighborTable.portDesc,
      })
      .from(lldpNeighborTable)
      .innerJoin(deviceTable, eq(lldpNeighborTable.deviceId, deviceTable.id))
      .leftJoin(systemTable, eq(deviceTable.id, systemTable.deviceId));

    // 2. Obtener todos los dispositivos registrados para intentar resolver el "target"
    const allDevices = await db
      .select({
        id: deviceTable.id,
        name: systemTable.sysName,
        ip: deviceTable.ipv4,
      })
      .from(deviceTable)
      .leftJoin(systemTable, eq(deviceTable.id, systemTable.deviceId));

    const deviceNameMap = new Map(
      allDevices
        .filter((d) => d.name)
        .map((d) => [d.name!.toLowerCase(), d.id]),
    );

    // 3. Obtener nombres de interfaces locales
    const interfaces = await db.select().from(interfaceTable);
    const ifMap = new Map<string, string>();
    interfaces.forEach((i) => {
      ifMap.set(`${i.deviceId}_${i.ifIndex}`, i.ifName || i.ifDescr || '');
    });

    const connections = neighbors.map((n) => {
      const targetId = n.neighborSysName
        ? deviceNameMap.get(n.neighborSysName.toLowerCase())
        : null;

      const localIfName = ifMap.get(`${n.sourceId}_${n.localPortNum}`);

      return {
        source: {
          id: n.sourceId,
          name: n.sourceName || n.sourceIp,
          ip: n.sourceIp,
          port: {
            num: n.localPortNum,
            name: localIfName || null,
          },
        },
        target: {
          id: targetId || null,
          name: n.neighborSysName || '',
          port: {
            id: n.neighborPortId || '',
            descr: n.neighborPortDesc || '',
          },
        },
        protocol: 'LLDP',
      };
    });

    // --- Lógica de tipos basada en el grado de conexión ---
    const degrees = new Map<string, number>();
    connections.forEach((conn) => {
      const src = conn.source.name;
      const tgt = conn.target.name || conn.target.port.id;
      degrees.set(src, (degrees.get(src) || 0) + 1);
      degrees.set(tgt, (degrees.get(tgt) || 0) + 1);
    });

    const getNodeType = (name: string) => {
      const d = degrees.get(name) || 0;
      if (d >= 6) return { type: 'Core', shape: ['((', '))'], color: '#f96' };
      if (d >= 3)
        return { type: 'Distribution', shape: ['([', '])'], color: '#6cf' };
      return { type: 'Access', shape: ['[', ']'], color: '#fff' };
    };

    // 4. Formatear según el parámetro solicitado
    if (format === 'simple') {
      const simplified = connections.map((item) => {
        const sourceName = item.source.name || item.source.ip;
        let targetName = item.target.name;
        if (!targetName || targetName === '') {
          targetName = item.target.port.id;
        }

        return {
          source: sourceName,
          target: targetName,
          sourcePort: item.source.port.name || item.source.port.num.toString(),
          targetPort: item.target.port.id || item.target.port.descr,
          protocol: item.protocol,
        };
      });
      return c.json(simplified, 200);
    }

    if (format === 'mermaid') {
      const lines: string[] = ['graph LR'];

      // Añadir definiciones de clases para colores
      lines.push('    classDef Core fill:#f96,stroke:#333,stroke-width:2px');
      lines.push(
        '    classDef Distribution fill:#6cf,stroke:#333,stroke-width:2px',
      );
      lines.push('    classDef Access fill:#fff,stroke:#333,stroke-width:1px');
      lines.push('');

      const definedNodes = new Set<string>();
      const sanitize = (val: string) => val.replace(/[-.: ]/g, '_');

      connections.forEach((link) => {
        const { source, target } = link;

        // --- ORIGEN ---
        const srcId = sanitize(source.name);
        const srcLabel = source.ip
          ? `${source.name} <br/> ${source.ip}`
          : source.name;
        const srcMeta = getNodeType(source.name);

        // --- DESTINO ---
        const targetRawName = target.name || target.port.id;
        const tgtId = sanitize(targetRawName);
        const tgtLabel = targetRawName;
        const tgtMeta = getNodeType(targetRawName);

        // --- PUERTOS ---
        const srcPort = source.port.name || source.port.num.toString();
        const tgtPort = target.port.id;

        // Definición de nodos con formas y clases de color
        if (!definedNodes.has(srcId)) {
          lines.push(
            `    ${srcId}${srcMeta.shape[0]}"${srcLabel}"${srcMeta.shape[1]}`,
          );
          lines.push(`    class ${srcId} ${srcMeta.type}`);
          definedNodes.add(srcId);
        }
        if (!definedNodes.has(tgtId)) {
          lines.push(
            `    ${tgtId}${tgtMeta.shape[0]}"${tgtLabel}"${tgtMeta.shape[1]}`,
          );
          lines.push(`    class ${tgtId} ${tgtMeta.type}`);
          definedNodes.add(tgtId);
        }

        // --- CONEXIÓN ---
        lines.push(`    ${srcId} -- "${srcPort} <-> ${tgtPort}" --- ${tgtId}`);
      });

      // Retornar texto plano directamente
      return c.text(lines.join('\n'), 200);
    }

    return c.json(
      connections.map((c) => ({
        ...c,
        source: { ...c.source, type: getNodeType(c.source.name).type },
        target: {
          ...c.target,
          type: getNodeType(c.target.name || c.target.port.id).type,
        },
      })),
      200,
    );
  } catch (error) {
    console.error(`[Switch Connections] Error:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
