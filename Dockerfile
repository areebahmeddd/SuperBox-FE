# SuperBox Frontend - Docker Image
# 
# Build:
#   docker build -t superbox-fe:latest \
#     --build-arg NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 \
#     --build-arg NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
#     --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com \
#     --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project \
#     --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.firebasestorage.app \
#     --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id \
#     --build-arg NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id \
#     --build-arg NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id \
#     .
#
# Run:
#   docker run -d -p 3000:3000 --name superbox-fe --env-file .env superbox-fe:latest

# Stage 1: Install dependencies
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Stage 2: Build the Next.js application
FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Production runtime with minimal dependencies
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs
EXPOSE 3000
CMD ["npm", "start"]
