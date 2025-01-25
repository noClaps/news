import html from "../src/index.html";

const server = Bun.serve({
  static: {
    "/": html,
  },
  development: true,
  fetch() {
    return new Response("Not found", { status: 404 });
  },
});
console.log(`Server started at ${server.url}`);
