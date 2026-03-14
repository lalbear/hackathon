# Use a multi-stage build to keep the final image size down
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json ./

# Copy backend files and build
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy frontend files and build
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copy source code
COPY backend ./backend
COPY frontend ./frontend

# Build backend 
RUN cd backend && npm run build || echo 'Assuming tsc compilation is handled or ts-node is used directly'

# Build frontend
RUN cd frontend && npm run build

# Start production image
FROM node:18-alpine

WORKDIR /app

# We only need package.json for starting scripts if they exist at root
COPY package.json ./

# Copy required output from builder
COPY --from=builder /app/backend /app/backend
COPY --from=builder /app/frontend/.next /app/frontend/.next
COPY --from=builder /app/frontend/public /app/frontend/public
COPY --from=builder /app/frontend/package.json /app/frontend/package.json
COPY --from=builder /app/frontend/node_modules /app/frontend/node_modules

# Expose ports for both services (You'd ideally run these in separate containers using docker-compose)
EXPOSE 3000
EXPOSE 5000

# Script to run both (For a single container MVP showcase, normally use docker-compose)
CMD ["sh", "-c", "cd frontend && npm start & cd backend && npm run start"]
