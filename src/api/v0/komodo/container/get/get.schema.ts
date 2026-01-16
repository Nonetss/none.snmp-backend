import { z } from '@hono/zod-openapi';

const containerStateSchema = z.object({
  Status: z.string(),
  Running: z.boolean(),
  Paused: z.boolean(),
  Restarting: z.boolean(),
  OOMKilled: z.boolean(),
  Dead: z.boolean(),
  Pid: z.number(),
  ExitCode: z.number(),
  Error: z.string(),
  StartedAt: z.string(),
  FinishedAt: z.string(),
  Health: z.any().nullable(),
});

const mountSchema = z.object({
  Type: z.string(),
  Name: z.string().optional(),
  Source: z.string(),
  Destination: z.string(),
  Driver: z.string().optional(),
  Mode: z.string(),
  RW: z.boolean(),
  Propagation: z.string(),
});

export const containerInspectSchema = z.object({
  Id: z.string(),
  Created: z.string(),
  Path: z.string(),
  Args: z.array(z.string()),
  State: containerStateSchema,
  Image: z.string(),
  ResolvConfPath: z.string(),
  HostnamePath: z.string(),
  HostsPath: z.string(),
  LogPath: z.string(),
  Name: z.string(),
  RestartCount: z.number(),
  Driver: z.string(),
  Platform: z.string(),
  MountLabel: z.string(),
  ProcessLabel: z.string(),
  AppArmorProfile: z.string(),
  ExecIDs: z.array(z.string()).nullable(),
  HostConfig: z
    .object({
      Binds: z.array(z.string()).nullable(),
      ContainerIDFile: z.string(),
      LogConfig: z.object({
        Type: z.string(),
        Config: z.record(z.string(), z.string()),
      }),
      NetworkMode: z.string(),
      PortBindings: z
        .record(
          z.string(),
          z
            .array(
              z.object({
                HostIp: z.string(),
                HostPort: z.string(),
              }),
            )
            .nullable(),
        )
        .nullable(),
      RestartPolicy: z.object({
        Name: z.string(),
        MaximumRetryCount: z.number(),
      }),
      AutoRemove: z.boolean(),
      VolumeDriver: z.string(),
      VolumesFrom: z.array(z.string()).nullable(),
    })
    .passthrough(),
  Mounts: z.array(mountSchema),
  Config: z
    .object({
      Hostname: z.string(),
      Domainname: z.string(),
      User: z.string(),
      AttachStdin: z.boolean(),
      AttachStdout: z.boolean(),
      AttachStderr: z.boolean(),
      ExposedPorts: z.record(z.string(), z.object({})).nullable(),
      Tty: z.boolean(),
      OpenStdin: z.boolean(),
      StdinOnce: z.boolean(),
      Env: z.array(z.string()),
      Cmd: z.array(z.string()),
      Image: z.string(),
      Volumes: z.record(z.string(), z.object({})).nullable(),
      WorkingDir: z.string(),
      Entrypoint: z.array(z.string()).nullable(),
      Labels: z.record(z.string(), z.string()).nullable(),
    })
    .passthrough(),
  NetworkSettings: z
    .object({
      Bridge: z.string().nullable(),
      SandboxID: z.string(),
      Ports: z.record(z.string(), z.any()).nullable(),
      SandboxKey: z.string(),
      Networks: z.record(
        z.string(),
        z.object({
          IPAMConfig: z.any().nullable(),
          Links: z.array(z.string()).nullable(),
          Aliases: z.array(z.string()).nullable(),
          NetworkID: z.string(),
          EndpointID: z.string(),
          Gateway: z.string(),
          IPAddress: z.string(),
          IPPrefixLen: z.number(),
          IPv6Gateway: z.string(),
          GlobalIPv6Address: z.string(),
          GlobalIPv6PrefixLen: z.number(),
          MacAddress: z.string(),
          DriverOpts: z.record(z.string(), z.string()).nullable(),
        }),
      ),
    })
    .passthrough(),
});

export const containerResponseSchema = containerInspectSchema;

export const containerMetadataSchema = z.object({
  exists: z.boolean(),
});

export const containerResponse = z.object({
  response: containerResponseSchema,
  metadata: containerMetadataSchema,
});
