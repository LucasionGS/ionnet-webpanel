import SharedUser from "../../../shared/SharedUser.ts";

namespace UserService {
  
  export async function login(username: string, password: string): Promise<SharedUser> {
    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }
    
    return new SharedUser(data.id, data.username);
  }

  export function logout() {
    localStorage.removeItem("user");
    location.href = "/login";
  }

  export function saveUser(user: SharedUser) {
    console.log("Saving user:", user);
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export default UserService;