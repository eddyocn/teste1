const countEl = document.getElementById('count');
const btn = document.getElementById('add');

chrome.storage.local.get(['count'], ({ count }) => {
  countEl.textContent = count || 0;
});

btn.addEventListener('click', async () => {
  const obj = await chrome.storage.local.get(['count']);
  const count = obj.count || 0;
  const newCount = count + 1;
  await chrome.storage.local.set({ count: newCount });
  countEl.textContent = newCount;
});
