/// @ts-check
const BLOCKLIST = ["news.ycombinator.com"];

const storyIds = await fetch(
  "https://hacker-news.firebaseio.com/v0/newstories.json",
).then((r) => r.json());

const mainElement = document.querySelector("main");
if (!mainElement) throw "Main element not found";
for (const storyId of storyIds) {
  const story = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`,
  ).then((r) => r.json());

  if (
    story.type !== "story" ||
    !story.url ||
    BLOCKLIST.includes(new URL(story.url).hostname)
  )
    continue;

  mainElement.insertAdjacentHTML(
    "beforeend",
    `<a href="${story.url}" target="_blank">${story.title.replaceAll("<", "&lt;")} <span class="dim">(${new URL(story.url).hostname})</span></a><hr>`,
  );
}
export {};
