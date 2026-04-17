FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy source
COPY src/ ./src/

# Expose port (Elastic Beanstalk uses PORT env var, default 8080)
EXPOSE 8080

ENV PORT=8080
ENV NODE_ENV=production

CMD ["node", "src/index.js"]
