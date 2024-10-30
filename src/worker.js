/**
 * @typedef {{
 * 	type: "story";
 * 	url: string;
 * 	title: string;
 * }} Story
 */

const blocklist = ["news.ycombinator.com", "twitter.com", "www.wsj.com"];

addEventListener("message", async ({ data }) => {
  const storyId = data;

  /** @type {Story} */
  let story = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`,
  )
    .then((r) => r.json())
    .catch((err) => {
      throw new Error(err);
    });

  if (
    story.type !== "story" ||
    !story.url ||
    blocklist.includes(new URL(story.url).hostname)
  ) {
    postMessage(null);
    return;
  }

  postMessage(
    `<a href="${story.url}" target="_blank">${story.title} <span class="dim">(${new URL(story.url).hostname})</span></a><hr>`,
  );
});
