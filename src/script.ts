const BLOCKLIST = [
  "news.ycombinator.com",
  "twitter.com",
  "www.wsj.com",
  "www.bloomberg.com",
  "www.ft.com",
  "www.nytimes.com",
  "x.com",
  "www.whio.com",
  "ai-flux.io",
];

interface Story {
  type: "story";
  url: string;
  title: string;
}

function escapeHTML(input: string) {
  return input
    .replaceAll(`&`, `&amp;`)
    .replaceAll(`"`, `&quot;`)
    .replaceAll(`'`, `&#x27;`)
    .replaceAll(`<`, `&lt;`)
    .replaceAll(`>`, `&gt;`);
}

const storyIds: number[] = await fetch(
  "https://hacker-news.firebaseio.com/v0/newstories.json",
)
  .then((r) => r.json())
  .catch((err) => {
    throw new Error(err);
  });

const mainElement = document.querySelector("main")!;
for (const storyId of storyIds) {
  const story: Story = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`,
  )
    .then((r) => r.json())
    .catch((err) => {
      throw new Error(err);
    });

  if (
    story.type !== "story" ||
    !story.url ||
    BLOCKLIST.includes(new URL(story.url).hostname)
  ) {
    continue;
  }

  mainElement.insertAdjacentHTML(
    "beforeend",
    `<a href="${story.url}" target="_blank">${escapeHTML(story.title)} <span class="dim">(${new URL(story.url).hostname})</span></a><hr>`,
  );
}

export {};
