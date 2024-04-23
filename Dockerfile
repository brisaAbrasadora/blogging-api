FROM node:20-alpine 

RUN mkdir -p /home/blogging-api

COPY . /home/blogging-api

WORKDIR /home/blogging-api

RUN npm install 

RUN npm run build

RUN npm prune --omit=dev

EXPOSE 3000

CMD ["node", "dist/main"]
