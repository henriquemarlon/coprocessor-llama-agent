# syntax=docker.io/docker/dockerfile:1

FROM ubuntu:22.04 AS rust-builder
ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH \
    RUST_VERSION=nightly
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        ca-certificates \
        g++-riscv64-linux-gnu \
        wget \
        pkg-config \
        libssl-dev && \
    dpkg --add-architecture riscv64 && \
    apt-get update && \
    apt-get install -y --no-install-recommends libssl-dev:riscv64-linux-gnu || true

RUN wget https://sh.rustup.rs -O rustup.sh && \
    sh rustup.sh -y --default-toolchain nightly && \
    rustup target add riscv64gc-unknown-linux-gnu

WORKDIR /usr/src/app
COPY . .
RUN cargo build --release --target riscv64gc-unknown-linux-gnu

FROM node:20.16.0-bookworm AS node-builder
WORKDIR /app
COPY . .
RUN yarn install && yarn build

FROM --platform=linux/riscv64 cartesi/node:20.16.0-jammy-slim
LABEL io.cartesi.rollups.sdk_version=0.11.1
LABEL io.cartesi.rollups.ram_size=128Mi
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        busybox-static=1:1.30.1-7ubuntu3 \
        curl && \
    rm -rf /var/lib/apt/lists/* /var/log/* /var/cache/* && \
    useradd --create-home --user-group dapp

ARG MACHINE_EMULATOR_TOOLS_VERSION=0.16.2-coprocessor2
ADD https://github.com/zippiehq/cartesi-coprocessor-emulator-tools/releases/download/v${MACHINE_EMULATOR_TOOLS_VERSION}/machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.deb /
RUN dpkg -i /machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.deb && \
    rm /machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.deb

ENV PATH="/opt/cartesi/bin:/opt/cartesi/dapp:${PATH}"
WORKDIR /opt/cartesi/dapp
COPY --from=rust-builder /usr/src/app/target/riscv64gc-unknown-linux-gnu/release/http-server /usr/local/bin/http-server
COPY --from=node-builder /app/node_modules /app/node_modules
COPY --from=node-builder /app/dist /app/dist

COPY startup.sh /usr/local/bin/startup.sh
RUN chmod +x /usr/local/bin/http-server /usr/local/bin/startup.sh


ENV ROLLUP_HTTP_SERVER_URL="http://127.0.0.1:5004"
ENTRYPOINT ["rollup-init"]
CMD ["/usr/local/bin/startup.sh"]
