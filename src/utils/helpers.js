import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export async function getLikedPosts(likedSlugs) {
  const promises = likedSlugs.map((slug) => getDoc(doc(db, "posts", slug)));
  const snapshots = await Promise.all(promises);

  return snapshots
    .filter((snap) => snap.exists())
    .map((snap) => ({ id: snap.id, ...snap.data() }));
}

export async function getBookmarkedPosts(bookmarkedSlugs) {
  const promises = bookmarkedSlugs.map((slug) =>
    getDoc(doc(db, "posts", slug)),
  );
  const snapshots = await Promise.all(promises);

  return snapshots
    .filter((snap) => snap.exists())
    .map((snap) => ({ id: snap.id, ...snap.data() }));
}
