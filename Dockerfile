FROM node:20-alpine
WORKDIR /app
COPY package.json server.js seed.js ./
COPY public ./public
ENV NODE_ENV=production
ENV PORT=3000
ENV DATA_DIR=/data
VOLUME ["/data"]
EXPOSE 3000
CMD ["node", "server.js"]
