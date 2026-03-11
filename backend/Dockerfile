FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY tsconfig.json ./
COPY shared/ ./shared/
COPY backend/ ./backend/

ARG SERVICE_NAME
ENV SERVICE_NAME=${SERVICE_NAME}

EXPOSE 3000

CMD ["sh", "-c", "npx tsx backend/${SERVICE_NAME}/src/index.ts"]
