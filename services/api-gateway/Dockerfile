FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY server.js ./
EXPOSE 5000
ENV GATEWAY_PORT=5000 NODE_ENV=production
CMD ["node", "server.js"]
