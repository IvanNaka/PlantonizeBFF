# Production-ready Dockerfile for Plantonize BFF
# Multi-stage build: install dependencies then copy runtime files

FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Copy package manifests and install production dependencies
COPY package*.json ./
RUN npm ci --only=production || npm install --only=production

# Copy source
COPY . .

FROM node:18-alpine
WORKDIR /usr/src/app

# Set production env
ENV NODE_ENV=production

# Copy app and dependencies from builder
COPY --from=builder /usr/src/app .

# Expose port used by the app
EXPOSE 3000

# Lightweight healthcheck using node (no extra tools required)
HEALTHCHECK --interval=30s --timeout=5s \
  CMD node -e "require('http').get('http://127.0.0.1:3000/health', function(res){process.exit((res.statusCode>=200&&res.statusCode<300)?0:1)}).on('error', function(){process.exit(1)})"

# Start the application
CMD ["node", "src/index.js"]
