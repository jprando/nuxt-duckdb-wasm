# ------------------------------------------------------------------------------
FROM oven/bun:alpine AS bun-base

WORKDIR /app

# ------------------------------------------------------------------------------
FROM bun-base AS bun-install

COPY package.json bun.lock /app/

RUN cd /app; bun install --frozen-lockfile

# ------------------------------------------------------------------------------
FROM bun-base AS bun-build

COPY --from=bun-install /app/node_modules /app/node_modules

COPY . .

RUN cd /app; bun run -b build

# ------------------------------------------------------------------------------
FROM alpine:latest AS release

WORKDIR /app

COPY --from=bun-build /app/nuxtbin /app/nuxtbin

# - https://github.com/oven-sh/bun/issues/23910
# - https://github.com/oven-sh/bun/issues/918
RUN apk add --no-cache libstdc++ libgcc

EXPOSE 3000/tcp

CMD ["/app/nuxtbin"]
