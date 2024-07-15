Bun.write("dist/favicon.png", Bun.file("src/favicon.png"));
Bun.write("dist/index.html", Bun.file("src/index.html"));
Bun.write("dist/style.css", Bun.file("src/style.css"));
Bun.write(
  "dist/script.js",
  await Bun.build({
    entrypoints: ["src/script.ts"],
    minify: true,
  }).then((bo) => bo.outputs[0].toString()),
);
