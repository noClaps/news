const html = await Bun.file("src/index.html").text();

const rw = new HTMLRewriter()
  .on("link[rel=stylesheet]", {
    async element(el) {
      const href = el.getAttribute("href")!;
      const style = await Bun.build({
        entrypoints: [href],
        experimentalCss: true,
        minify: true,
      }).then((bo) => bo.outputs[0].text());
      el.replace(`<style>${style}</style>`, { html: true });
    },
  })
  .on("script[src]", {
    async element(el) {
      const src = el.getAttribute("src")!;
      const script = await Bun.build({
        entrypoints: [src],
        minify: true,
      }).then((bo) => bo.outputs[0].text());
      el.replace(`<script type="module">${script}</script>`, {
        html: true,
      });
    },
  });

Bun.write("dist/index.html", rw.transform(html));
Bun.write("dist/favicon.png", Bun.file("src/favicon.png"));

Bun.build({
  entrypoints: ["src/worker.ts"],
  minify: true,
  outdir: "dist",
});
