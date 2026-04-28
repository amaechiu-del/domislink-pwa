FROM node:20-alpine

WORKDIR /app

# Copy package manifest and install production dependencies
COPY package.json ./
RUN npm install --omit=dev

# Copy application source (validators.js is included under src/)
COPY src/ ./src/

# Expose port (Elastic Beanstalk uses PORT env var, default 8080)
EXPOSE 8080

ENV PORT=8080
ENV NODE_ENV=production

CMD ["node", "src/index.js"]
