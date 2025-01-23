# MUST BE RUN FROM /implementation CONTEXT AND NOT FROM /implementation/feather
# docker build -f Dockerfile ..

FROM ubuntu:24.10 AS runner-base

RUN apt-get -y update
RUN apt-get -y install curl libargon2-1


FROM denoland/deno:2.1.4 AS builder

WORKDIR /app/feather

COPY ./jobberknoll ../jobberknoll
COPY ./feather/deno.json ./feather/deno.lock ./
RUN deno install
COPY ./feather .
RUN deno task compile


FROM runner-base AS runner

EXPOSE 8001
WORKDIR /app
USER ubuntu

COPY --from=builder ./app/feather/feather ./feather
CMD ["./feather"]
