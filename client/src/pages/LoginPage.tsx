import { useEffect, useRef } from 'react'
import { Button, TextInput } from "@mantine/core";
import PageTransition from "../components/PageTransition.tsx";
import { useRoute } from "../packages/router/index.tsx";
import { useIonnet } from "../providers/IonnetProvider.tsx";
import UserService from "../services/UserService.ts";

export default function LoginPage() {
  const route = useRoute();
  const ionnet = useIonnet();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    ionnet.setShowSidebar(false);
  }, []);

  return (
    <PageTransition>
      <h2 className="text-2xl">Login</h2>
      <p>
        Please log in.
      </p>
      <div className="mt-5">
        <form ref={formRef} onSubmit={event => {
          event.preventDefault();
          const formData = new FormData(formRef.current!);
          const username = formData.get("username") as string;
          const password = formData.get("password") as string;
          // Log in
          UserService.login(username, password).then((user) => {
            if (user) {
              UserService.saveUser(user);
              ionnet.setShowSidebar(true);
              route.navigate("/");
            }
          });
        }}>
          <TextInput
            placeholder="Username"
            name="username"
            className="w-full"
          />
          <TextInput
            placeholder="Password"
            name="password"
            type="password"
            className="w-full mt-3"
          />
          <Button
            className="mt-3"
            type="submit"
          >
            Log in
          </Button>
        </form>
      </div>
    </PageTransition>
  )
}
