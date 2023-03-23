FROM node:18-bullseye

WORKDIR /app
COPY . .

RUN yarn install

ENV DATABASE_URL file:./dev.db

RUN yarn run prisma migrate dev && yarn run prisma db seed

ENV NODE_ENV development
ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 3000

ENV PORT 3000

CMD ["yarn", "dev"]