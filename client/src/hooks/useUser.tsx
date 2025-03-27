import { useEffect, useState } from "react";
import SharedUser from "../../../shared/SharedUser.ts";
import UserService from "../services/UserService.ts";
import { useRoute } from "../packages/router/index.tsx";

export default function useUser(opts?: { optional?: boolean }) {
  const { optional = false } = opts || {};
  const [user, setUser] = useState<SharedUser | null>(null);
  const route = useRoute();

  useEffect(() => {
    fetch("/api/user")
      .then(async response => {
        if (response.ok) {
          const json = await response.json();
          return json;
        }
        else {
          return null;
        }
      })
      .then((data: SharedUser | null) => {
        if (data) {
          const user = new SharedUser(data.id, data.username, data.token)
          UserService.saveUser(user);
          setUser(user);
        }
        else {
          localStorage.removeItem("user");
          setUser(null);
          if (!optional) {
            // Send to login page
            route.navigate("/login");
          }
        }
      })
  }, []);
  
  return {
    user,
    setUser
  }
}