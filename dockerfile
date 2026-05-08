FROM node:20-alpine3.23
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
USER node
EXPOSE 3000
CMD ["node", "src/index.js"]
