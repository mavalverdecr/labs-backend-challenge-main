# syntax=docker/dockerfile:1-labs
FROM node:iron-alpine AS builder
COPY --exclude=node_modules --exclude=dist --exclude=package-lock.json --exclude=.env --exclude=DockerFile . /builder 
WORKDIR /builder
RUN npm install
RUN npm run build

FROM node:iron-alpine AS worker
COPY --from=builder /builder/dist ./dist
COPY --from=builder /builder/node_modules ./node_modules
COPY --from=builder /builder/package.json ./package.json
COPY --from=builder /builder/assets/order_service_openapi.yaml ./assets/order_service_openapi.yaml
ENTRYPOINT ["npm", "start"]