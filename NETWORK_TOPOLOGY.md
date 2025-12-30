# Arquitectura de Datos y Topología de Red (SNMP)

Este documento detalla la estructura de la base de datos, las relaciones entre los protocolos SNMP implementados y la metodología para reconstruir la topología de la red mediante grafos.

## 1. Modelo de Datos (Esquema de Tablas)

El sistema utiliza un modelo relacional centrado en el dispositivo (`device`), extendiéndose hacia capas L2 (Enlace) y L3 (Red).

### Capa Core (Identificación)

- **`device`**: Almacena el nodo principal, su IPv4 y su configuración de autenticación SNMP.
- **`system`**: Información descriptiva del dispositivo (Hostname, Descripción, Ubicación).
- **`entity_physical`**: Inventario de hardware (Chasis, Módulos, Números de serie).

### Capa L2 (Conmutación y Adyacencia)

- **`interface`**: Catálogo de puertos físicos y lógicos (`ifIndex`, MAC, Speed).
- **`bridge_port`**: Mapeo entre el puerto de conmutación (Bridge Port) y el índice de interfaz física (`ifIndex`). Incluye el `pvid` (VLAN nativa).
- **`vlan`**: Inventario de VLANs configuradas y sus miembros (puertos tagged/untagged).
- **`bridge_fdb` / `bridge_fdb_q`**: Tablas de forwarding. Indican qué dirección MAC ha sido vista en qué puerto del bridge.
- **`cdp_neighbor` / `lldp_neighbor`**: Tablas de vecinos directos mediante protocolos de descubrimiento.

### Capa L3 (Enrutamiento y Direccionamiento)

- **`ip_addr_entry`**: Direcciones IP asignadas a las interfaces del dispositivo.
- **`ip_net_to_media_table`**: Tabla ARP. Mapeo entre Direcciones IP y Direcciones MAC.
- **`route`**: Tabla de rutas IP (Destino, Máscara, Siguiente Salto).

---

## 2. Metodología de Reconstrucción de Topología

Para generar un grafo de red completo, se deben cruzar los datos de las tablas anteriores siguiendo esta jerarquía de confianza:

### Nivel 1: Adyacencia por Protocolo (CDP/LLDP)

Es el método más preciso para conectar dos equipos de red (Switch-Switch, Switch-Router).

- **Origen:** `device_A` -> `cdp_neighbor` / `lldp_neighbor`.
- **Cruce:** Si `neighbor_sys_name` o `neighbor_chassis_id` coincide con el `sysName` o `MAC` de `device_B`.
- **Resultado:** Enlace directo entre `device_A:port_X` y `device_B:port_Y`.

### Nivel 2: Inferencia por Tabla de Direcciones (FDB)

Permite conectar dispositivos que no tienen SNMP o no hablan protocolos de descubrimiento (Cámaras, PCs, Access Points).

- **Origen:** `device_A` -> `bridge_fdb_q`.
- **Cruce:**
  1. Obtener MAC del `device_B` (desde su tabla `interface` o `system`).
  2. Buscar esa MAC en la tabla `bridge_fdb_q` del `device_A`.
  3. Identificar el `bridgePort` y mapearlo a la `interface` física mediante `bridge_port`.
- **Resultado:** Conexión de acceso entre un Switch y un Host Final.

### Nivel 3: Correlación L3 (Rutas y ARP)

Útil para dibujar nubes de red o saltos entre subredes.

- **Origen:** `device_A` -> `route`.
- **Cruce:**
  1. Si `route.nextHop` es una IP que pertenece al `device_B` (verificado en `ip_addr_entry`).
  2. Confirmar mediante ARP (`ip_net_to_media_table`) que la MAC del `nextHop` coincide con la de `device_B`.
- **Resultado:** Enlace lógico de enrutamiento.

---

## 3. Estructura de Grafo Propuesta

Para representar esto programáticamente (ej. D3.js, Cytoscape, vis.js), se debe estructurar la información en **Nodos** y **Aristas**.

### Nodos (Nodes)

```typescript
interface Node {
  id: string; // deviceId
  label: string; // system.sysName o device.ipv4
  type: string; // 'router' | 'switch' | 'host' | 'ap'
  metadata: {
    vendor: string; // entity_physical.mfgName
    model: string; // entity_physical.modelName
    ip: string;
  };
}
```

### Aristas (Edges)

```typescript
interface Edge {
  source: string; // deviceId origen
  target: string; // deviceId destino
  protocol: string; // 'LLDP' | 'CDP' | 'FDB' | 'STATIC'
  sourceIf: string; // Interfaz local (ej. Gi0/1)
  targetIf: string; // Interfaz remota
  vlan?: number; // VLAN asociada
}
```

## 4. Algoritmo de Consolidación (Pseudo-código)

1.  **Cargar Nodos:** `SELECT * FROM device JOIN system ON ...`
2.  **Identificar Enlaces Backbone (LLDP/CDP):**
    - Iterar por cada vecino descubierto.
    - Intentar resolver el vecino contra un `deviceId` existente.
    - Si hay coincidencia, crear `Edge` y marcar puertos como "Ocupados".
3.  **Identificar Enlaces de Acceso (FDB):**
    - Para MACs en `bridge_fdb` que no fueron resueltas en el paso anterior.
    - Si la MAC corresponde a un dispositivo conocido, crear `Edge`.
4.  **Limpiar Duplicados:**
    - Un enlace `A -> B` es el mismo que `B -> A`. Consolidar en una única arista bidireccional.
5.  **Detección de Jerarquía:**
    - Nodos con muchas conexiones CDP/LLDP -> Core/Distribution.
    - Nodos con muchas conexiones FDB y una sola de Uplink -> Access/Edge.
