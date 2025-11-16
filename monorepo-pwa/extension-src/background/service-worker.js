chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ count: 0 });
});
