FROM node:18-bullseye
ARG ORACLE_BOT_REPO

RUN git clone ${ORACLE_BOT_REPO} /app

WORKDIR /app

COPY docker/.env ./.env

RUN yarn install

CMD ["/bin/bash", "run.sh"]