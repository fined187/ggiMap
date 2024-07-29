# Base image setup
FROM node:18-alpine AS base

# Dependencies installation stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app

# Copy your package files
COPY package.json yarn.lock ./

# Disable PnP and use node_modules instead
RUN echo "nodeLinker: node-modules" >> .yarnrc.yml

# Install dependencies
RUN corepack enable && yarn install

# Check the installed files
RUN ls -al /usr/src/app/node_modules/.bin

# Build stage
FROM base AS builder
WORKDIR /usr/src/app

# Copy necessary files from deps
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/.yarn ./.yarn/
COPY --from=deps /usr/src/app/yarn.lock .

# Copy the rest of your application code
COPY . .

# Check that next is available
RUN ls -al ./node_modules/.bin

# Try building your project and log any errors
RUN yarn build

# Remove next build cache if necessary
RUN rm -rf ./.next/cache

# Production stage
FROM base AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Create a user and group
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files for production
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next/static ./.next/static
COPY --from=builder /usr/src/app/.next/standalone ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/yarn.lock .

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
