import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { doc, onSnapshot } from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    let unsubscribeProfile = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log(currentUser);

      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (currentUser) {
        unsubscribeProfile = onSnapshot(
          doc(db, "users", currentUser.uid),
          (snap) => {
            setUserProfile(snap.exists() ? snap.data() : null);
            setCheckingAuth(false);
          },
        );
      } else {
        setUserProfile(null);
        setCheckingAuth(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  if (checkingAuth) {
    return (
      <div className="app-loading">
        <ClipLoader color="var(--accent)" size={30} />
        <span className="mono" style={{ color: "var(--accent)" }}>
          LOADING APP
        </span>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, userProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
