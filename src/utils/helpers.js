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
        pixelCrop.height,
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
