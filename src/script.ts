type Story = {
  type: "story";
  url: string;
  title: string;
};

const mainElement = document.querySelector("main");
if (!mainElement) throw new Error("Main element not found");

const blocklist: string[] = [];

const storyIds: number[] = await fetch(
  "https://hacker-news.firebaseio.com/v0/newstories.json",
)
  .then((r) => r.json())
  .catch((err) => {
    throw new Error(err);
  });

for (const storyId of storyIds) {
  const story: Story = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`,
  )
    .then((r) => r.json())
    .catch((err) => {
      throw new Error(err);
    });

  if (
    story.type === "story" &&
    story.url &&
    !blocklist.includes(new URL(story.url).hostname)
  ) {
    mainElement.insertAdjacentHTML(
      "beforeend",
      `<a href="${story.url}" target="_blank">${story.title} <span class="dim">(${new URL(story.url).hostname})</span></a><hr>`,
    );
  }
}
