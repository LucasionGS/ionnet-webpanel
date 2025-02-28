import { useEffect, useState } from "react";
import SharedUser from "../../../shared/SharedUser.ts";

export default function useUser() {
  const [user, setUser] = useState<SharedUser | null>(null)

  useEffect(() => {
    fetch("/api/user")
      .then(response => response.json())
      .then(data => {
        setUser(new SharedUser(data))
      });
  }, []);
  
  return {
    user,
    setUser
  }
}