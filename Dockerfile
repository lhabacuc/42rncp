FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV development

RUN mkdir -p .next

COPY --from=deps /app/node_modules ./node_modules
COPY . .

CMD [ "npm", "run", "dev" ]
