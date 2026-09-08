FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY --chown=node:node . .

RUN npm run build

USER node

CMD ["node", "dist/index.js"]
