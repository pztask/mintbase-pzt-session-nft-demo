FROM rust:1.61-bullseye

SHELL ["/bin/bash", "-c"]

WORKDIR /usr/src/myapp
COPY . .

ENV CARGO_NET_GIT_FETCH_WITH_CLI=true
RUN rustup target add wasm32-unknown-unknown

RUN apt update
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
apt install -y nodejs
RUN npm install -g near-cli yarn

RUN chmod +x deploy

CMD ["/bin/bash", "deploy"]