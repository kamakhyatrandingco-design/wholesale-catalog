FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY server.js ./
EXPOSE 5003
ENV PORT=5003 NODE_ENV=production
CMD ["node", "server.js"]
