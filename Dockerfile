# syntax=docker/dockerfile:1.7-labs

FROM node:21-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat tzdata
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY --parents apps/*/package.json .
COPY --parents packages/*/package.json .
# COPY apps/web/package.json ./apps/web/package.json
# COPY packages/appStore/package.json ./packages/appStore/package.json
# COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
# COPY packages/services/package.json ./packages/services/package.json
# COPY packages/tailwind-config/package.json ./packages/tailwind-config/package.json
# COPY packages/types/package.json ./packages/types/package.json
# COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
# COPY packages/ui/package.json ./packages/ui/package.json
# COPY packages/utils/package.json ./packages/utils/package.json
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
ENV MONGODB_URI=mongodb://mongo:27017/vivid?retryWrites=true&w=majority

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy of i18n jsons
COPY --from=builder /app/apps/web/src/i18n/locales ./src/i18n/locales

# Copy node modules for scheduler
COPY --from=builder /app/node_modules/node-cron ./node_modules/node-cron
COPY --from=builder /app/node_modules/dotenv ./node_modules/dotenv

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/scheduler.js ./scheduler.js
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV AUTH_PASSWORD=passwd

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" ./entrypoint.sh