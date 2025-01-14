FROM denoland/deno:2.1.4

WORKDIR /app

RUN apt-get -y update
RUN apt-get -y install curl

COPY deno.json deno.lock api/deno.json app/deno.json core/deno.json infra/deno.json ./
RUN deno install
COPY . .

EXPOSE 8000
CMD ["deno", "run", "start"]
