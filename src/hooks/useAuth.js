import { useEffect, useState } from "react";
import { subscribeToAuth } from "../lib/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAuth((u) => {
      setUser(u);
      setChecking(false);
    });
    return unsub;
  }, []);

  return { user, checking };
}
