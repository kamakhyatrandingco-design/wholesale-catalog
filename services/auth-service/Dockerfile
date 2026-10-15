FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY server.js ./
EXPOSE 5002
ENV PORT=5002 NODE_ENV=production
CMD ["node", "server.js"]
