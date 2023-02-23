FROM node:18-bullseye

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn build

RUN yarn run prisma migrate dev && yarn run prisma db seed

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 3000

ENV PORT 3000

CMD ["yarn", "start"]