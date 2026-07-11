import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

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
    email: user.email,
    role: "user",
    id: crypto.randomUUID(),
    username: username,
    liked: [],
  });

  return user;
}
