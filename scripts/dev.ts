import type { Serve } from "bun";
import fs from "node:fs";

const serverOptions: Serve = {
  async fetch({ url }) {
    const path = new URL(url).pathname;

    if (path === "/") {
      return new Response(Bun.file("src/index.html"));
    }

    if (path === "/script.js") {
      return new Response(
        await Bun.build({
          entrypoints: ["src/script.ts"],
        }).then((bo) => bo.outputs[0].text()),
        {
          headers: {
            "Content-Type": "application/javascript",
          },
        },
      );
    }

    if (await Bun.file(`src${path}`).exists()) {
      return new Response(Bun.file(`src${path}`));
    }

    return new Response("Not found", { status: 404 });
  },
};

const server = Bun.serve(serverOptions);
console.log(`Server started at ${server.url}`);
fs.watch("src", (event, filename) => {
  console.log(`Detected ${event} in ${filename}. Reloading...`);
  server.reload(serverOptions);
});
