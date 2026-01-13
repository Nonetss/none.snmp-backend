FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install dependencies into temp directory
# this will cache them and speed up future builds
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [Optional] tests & build
ENV NODE_ENV=production
# RUN bun test
# RUN bun run build

# Copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app/src src
COPY --from=prerelease /app/tsconfig.json .
COPY --from=prerelease /app/package.json .
COPY --from=prerelease /app/drizzle.config.ts .
COPY --from=prerelease /app/OID OID
COPY --from=prerelease /app/drizzle drizzle

RUN apt-get update && apt-get install -y \
    git \
    curl \
    iputils-ping \
    snmp \
    traceroute \
    && rm -rf /var/lib/apt/lists/*

# Run the app
USER bun
EXPOSE 3000/tcp
CMD [ "bun", "run", "src/index.ts" ]
