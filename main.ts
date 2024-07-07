import Elysia from "elysia";
import staticPlugin from "@elysiajs/static";

type Story = {
  id: number;
  type: "story";
  by: string;
  time: number; // Unix time
  url: string;
  score: number;
  title: string;
  descendents: number;
};

class Stories {
  #storyIds: number[] = [];
  #index = 0;
  #blocklist: string[] = []; // hostnames

  async getStoryIds() {
    this.#storyIds = (await fetch(
      "https://hacker-news.firebaseio.com/v0/newstories.json",
    )
      .then((r) => r.json())
      .catch((err) => console.log(err))) as number[];

    this.#index = 0;
  }

  async getPost(index?: number): Promise<[number, Story]> {
    if (index && index > this.#index) {
      this.#index = index;
    }

    const story = (await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${this.#storyIds[this.#index]}.json`,
    )
      .then((r) => r.json())
      .catch((err) => console.log(err))) as Story;

    if (
      story.type !== "story" ||
      !story.url ||
      this.#blocklist.includes(new URL(story.url).hostname)
    ) {
      this.#index++;
      return await this.getPost();
    }

    return [this.#index, story];
  }
}

const stories = new Stories();

const app = new Elysia()
  .use(staticPlugin())
  .get("/", async () => {
    await stories.getStoryIds();
    return Bun.file("src/index.html");
  })
  .get("/style.css", () => Bun.file("src/style.css"))
  .get("/script.js", async ({ set }) => {
    set.headers["Content-Type"] = "application/javascript";
    return (
      await Bun.build({ entrypoints: ["src/script.ts"], minify: true })
    ).outputs[0]?.text();
  })
  .get("/posts", async ({ query }) => {
    const page = +(query.page ?? 0);
    const [index, post] = await stories.getPost(page);

    return `<a href="${post.url}" target="_blank" hx-get="/posts?page=${index + 1}" hx-target="main" hx-trigger="${!(index % 25) ? "revealed" : "load once"}" hx-swap="beforeend">${post.title} <span class="dim">(${new URL(post.url).hostname})</span> </a><hr>`;
  })
  .listen(Bun.env.PORT || 8080);

console.log(`Listening on ${app.server?.url}`);
