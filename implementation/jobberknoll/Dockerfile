FROM denoland/deno:2.1.4 AS builder

WORKDIR /app

COPY deno.json deno.lock api/deno.json app/deno.json core/deno.json infra/deno.json ./
RUN deno install
COPY . .
RUN deno task compile


FROM ubuntu:24.10 AS runner

RUN apt-get -y update
RUN apt-get -y install curl

EXPOSE 8000
WORKDIR /app
USER ubuntu

COPY --from=builder ./app/jobberknoll ./jobberknoll
CMD ["./jobberknoll"]
