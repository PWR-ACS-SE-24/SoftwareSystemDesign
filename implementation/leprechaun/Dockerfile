FROM node:22-alpine AS base

FROM base AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
COPY . /app
RUN corepack enable && pnpm fetch --prod && pnpm run build

FROM base AS runner
WORKDIR /app
RUN apk add --no-cache curl
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist

EXPOSE 3000
CMD [ "node", "dist/main.js" ]