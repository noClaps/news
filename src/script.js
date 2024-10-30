const mainElement = document.querySelector("main");
if (!mainElement) throw new Error("Main element not found");

/** @type {number[]} */
const storyIds = await fetch(
  "https://hacker-news.firebaseio.com/v0/newstories.json",
)
  .then((r) => r.json())
  .catch((err) => {
    throw new Error(err);
  });

const MAX_CONCURRENT_WORKERS = navigator.hardwareConcurrency;
let activeWorkers = 0;
let currentIndex = 0;

function processNextStory() {
  if (
    currentIndex >= storyIds.length ||
    activeWorkers >= MAX_CONCURRENT_WORKERS
  ) {
    return;
  }

  const storyId = storyIds[currentIndex++];
  activeWorkers++;

  const worker = new Worker("/worker.js", { type: "module" });
  worker.postMessage(storyId);

  worker.addEventListener("message", ({ data }) => {
    if (data) mainElement.insertAdjacentHTML("beforeend", data);
    worker.terminate();
    activeWorkers--;
    processNextStory();
  });
}

for (let i = 0; i < MAX_CONCURRENT_WORKERS; i++) {
  processNextStory();
}
