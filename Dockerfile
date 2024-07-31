# Base image setup
FROM node:18-alpine AS base

# Dependencies installation stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app

# Copy your package files
COPY package.json yarn.lock ./

# Make sure corepack is active for Yarn 2+
RUN corepack enable && yarn install

# Check the installed files
RUN ls -al /usr/src/app

# Build stage
FROM base AS builder
WORKDIR /usr/src/app

# Ensure .yarn and .pnp files are copied correctly
COPY --from=deps /usr/src/app/.yarn/ ./.yarn/
COPY --from=deps /usr/src/app/.pnp* ./

# Copy the rest of your application code
COPY . .

# Try building your project and log any errors
RUN yarn build

# Remove next build cache if necessary
RUN rm -rf ./.next/cache

# Production stage
FROM base AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next/static ./.next/static
COPY --from=builder /usr/src/app/.next/standalone ./

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
