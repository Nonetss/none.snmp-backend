# NONE.SNMP Backend

Un potente motor de descubrimiento y gestión de red basado en **SNMP**, diseñado para proporcionar visibilidad completa sobre la topología y el inventario de dispositivos en tiempo real.

## 🚀 Características Principales

- **Descubrimiento Inteligente:** Escaneo de subredes mediante ICMP y validación automática de credenciales SNMP (v1, v2c, v3).
- **Topología de Red:** Generación de grafos de conexión cruzando datos de **LLDP**, **CDP**, y tablas de reenvío (**FDB/Bridge**).
- **Inventario Detallado:** Recolección profunda de:
  - Información de sistema (Nombre, descripción, ubicación, uptime).
  - Interfaces de red (Estado, velocidad, tráfico, direcciones físicas).
  - Software instalado y procesos en ejecución (con métricas de CPU/Memoria).
  - Tablas de enrutamiento y direccionamiento IP.
  - Entidades físicas (Chasis, módulos, números de serie).
- **Programador de Tareas (Scheduler):** Automatización de escaneos y recolección de datos mediante expresiones Cron.
- **Búsqueda Avanzada:** Localización de dispositivos por IP/MAC y búsqueda "fuzzy" de aplicaciones o servicios en toda la red.
- **Documentación Nativa:** API totalmente documentada con **OpenAPI** y **Scalar**.

## 🛠️ Stack Tecnológico

- **Runtime:** [Bun](https://bun.sh/)
- **Framework:** [Hono](https://hono.dev/) con `@hono/zod-openapi`
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Base de Datos:** PostgreSQL
- **Protocolos:** ICMP, SNMP (net-snmp)

## 📁 Estructura del Proyecto

El proyecto sigue una arquitectura orientada a recursos y acciones:

```text
src/
├── api/v1/
│   ├── search/         # Endpoints de consulta (Datos, Grafo, Inventario)
│   └── snmp/           # Endpoints de acción (Scan, Poll, Auth, Scheduler)
├── core/               # Configuración global y servicios de fondo (Scheduler)
├── db/                 # Esquemas de base de datos y migraciones
├── lib/                # Lógica de bajo nivel (SNMP, ICMP, IP Utils)
└── OID/                # Definiciones JSON de MIBs y OIDs estándar
```

## ⚙️ Configuración

1.  **Instalar dependencias:**

    ```bash
    bun install
    ```

2.  **Variables de Entorno:**
    Crea un archivo `.env` basado en `.env.example`:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/snmp_db"
    ```

3.  **Base de Datos:**
    Generar y ejecutar las migraciones:
    ```bash
    bunx drizzle-kit generate
    ```
    ```bash
    bunx drizzle-kit migrate
    ```

## 🚀 Ejecución

Para iniciar el servidor en modo desarrollo:

```bash
bun dev
```

El backend estará disponible en `http://localhost:3000`.

### Documentación de la API

- **Interactivo (Scalar):** [http://localhost:3000/scalar](http://localhost:3000/scalar)
- **JSON OpenAPI:** [http://localhost:3000/doc](http://localhost:3000/doc)

## ⏰ Automatización (Scheduler)

Puedes programar tareas automáticas a través de la API (`/api/v1/snmp/scheduler`).
Soportamos expresiones Cron estándar de 5 campos:

- `SCAN_ALL_SUBNETS`: Re-escanea todas las redes registradas.
- `POLL_ALL`: Actualiza los datos de todos los dispositivos conocidos.
- `SCAN_SUBNET`: Escanea un rango específico (requiere `targetId`).

---

Desarrollado con ❤️ para la gestión moderna de infraestructuras de red.
