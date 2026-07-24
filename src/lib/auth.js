import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();

function buildShortName(fullName) {
  const words = fullName.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  const first = words[0][0];
  const last = words[words.length - 1][0];

  return (first + last).toUpperCase();
}

export async function login(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

export async function signup(email, password, username) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    username: username || "New User",
    shortName: buildShortName(username || "NU"),
    role: "user",
    likes: [],
    bookmarks: [],
    followings: [],
    followers: [],
    photoURL:"",
    createdAt: serverTimestamp(),
  });

  return user;
}

export async function googleLogin() {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const userDoc = await getDoc(doc(db, "users", user.uid));

  if (!userDoc.exists()) {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      username: user.displayName || "New User",
      shortName: buildShortName(user.displayName || "New User"),
      role: "user",
      liked: [],
      bookmarks: [],
      followings: [],
      createdAt: serverTimestamp(),
    });
  }

  return user;
}
