const BLOCKLIST = [
  "news.ycombinator.com",
  "twitter.com",
  "www.wsj.com",
  "www.bloomberg.com",
  "www.ft.com",
];

interface Story {
  type: "story";
  url: string;
  title: string;
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
    `<a href="${story.url}" target="_blank">${story.title} <span class="dim">(${new URL(story.url).hostname})</span></a><hr>`,
  );
}
