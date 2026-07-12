FROM node:22-alpine AS deps

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22-alpine AS production

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nextjs && adduser -S nextjs -u 1001

COPY --from=build --chown=nextjs:nextjs /app/package.json ./package.json
COPY --from=build --chown=nextjs:nextjs /app/package-lock.json ./package-lock.json
COPY --from=build --chown=nextjs:nextjs /app/next.config.mjs ./next.config.mjs
COPY --from=build --chown=nextjs:nextjs /app/public ./public
COPY --from=build --chown=nextjs:nextjs /app/.next ./.next
COPY --from=build --chown=nextjs:nextjs /app/node_modules ./node_modules

USER nextjs
EXPOSE 3000

CMD ["npm", "run", "start"]
