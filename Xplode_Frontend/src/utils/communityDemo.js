import demoPosts from "../data/communityDemo.json";

const DEMO_KEY = "xplode-community-demo-interactions";
export function getDemoPosts() {
  let interactions = {};
  try { interactions = JSON.parse(localStorage.getItem(DEMO_KEY) || "{}"); } catch { /* Demo posts still render if storage is unavailable. */ }
  return demoPosts.map((post) => ({ ...post, ...interactions[post.id], demo: true }));
}
export function updateDemoPost(postId, update) {
  try {
    const data = JSON.parse(localStorage.getItem(DEMO_KEY) || "{}");
    const original = demoPosts.find((post) => post.id === postId);
    if (!original) return false;
    const updated = update({ ...original, ...data[postId] });
    data[postId] = { vote: updated.vote || 0, comments: updated.comments || [] };
    localStorage.setItem(DEMO_KEY, JSON.stringify(data));
    return true;
  } catch { return false; }
}
