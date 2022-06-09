# Install dependencies only when needed
FROM node:16-alpine
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
ENV NODE_ENV development

EXPOSE 3000
# make the port accessible in process.PORT in node js
ENV PORT 3000

CMD ["npm", "run", "dev"]
