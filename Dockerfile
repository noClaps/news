FROM oven/bun

COPY package.json bun.lockb ./
RUN --mount=type=cache,id=s/ad716af1-7981-4f80-8b57-4270d084d848-/root/bun,target=/root/.bun bun install -p

COPY . ./

CMD [ "bun", "start" ]
EXPOSE 8080
