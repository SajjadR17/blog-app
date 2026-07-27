import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

export async function getLikedPosts(likedPostIds) {
  const promises = likedPostIds.map((postId) =>
    getDoc(doc(db, "posts", postId))
  );

  const snapshots = await Promise.all(promises);

  return snapshots
    .filter((snap) => snap.exists())
    .map((snap) => ({
      id: snap.id,
      ...snap.data(),
    }));
}

export async function getBookmarkedPosts(bookmarkedPostIds) {
  const promises = bookmarkedPostIds.map((postId) =>
    getDoc(doc(db, "posts", postId))
  );

  const snapshots = await Promise.all(promises);

  return snapshots
    .filter((snap) => snap.exists())
    .map((snap) => ({
      id: snap.id,
      ...snap.data(),
    }));
}

export const getUserPublishedPosts = async (authorId) => {
  const q = query(
    collection(db, "posts"),
    where("authorUid", "==", authorId),
    orderBy("date", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getCroppedImg = (imageSrc, pixelCrop) => {
  return new Promise((resolve) => {
    const image = new Image();

    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        const file = new File([blob], "avatar.jpeg", {
          type: "image/jpeg",
        });

        resolve(file);
      }, "image/jpeg");
    };
  });
};