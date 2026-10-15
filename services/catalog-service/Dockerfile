FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY server.js ./
EXPOSE 5001
ENV PORT=5001 NODE_ENV=production
CMD ["node", "server.js"]
