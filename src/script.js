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
  "etechx.co.ke",
];

/**
 * @typedef {object} Story
 * @property {"story"} type
 * @property {string} url
 * @property {string} title
 */

/**
 *
 * @param {string} input
 * @returns {string}
 */
function escapeHTML(input) {
  return input
    .replaceAll(`&`, `&amp;`)
    .replaceAll(`"`, `&quot;`)
    .replaceAll(`'`, `&#x27;`)
    .replaceAll(`<`, `&lt;`)
    .replaceAll(`>`, `&gt;`);
}

/** @type number[] */
const storyIds = await fetch(
  "https://hacker-news.firebaseio.com/v0/newstories.json",
).then((r) => r.json());

const mainElement = document.querySelector("main");
for (const storyId of storyIds) {
  /** @type Story */
  const story = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`,
  ).then((r) => r.json());

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
