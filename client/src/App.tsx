import "./App.scss"
import reactLogo from "./assets/react.svg"
import { AppShell, Avatar, Button, Stack } from "@mantine/core";
import { Link, RouterDisplay } from "./packages/router/index.tsx";
import { useIonnet } from "./providers/IonnetProvider.tsx";

function App() {
  const ionnet = useIonnet();

  return (
    <AppShell
      header={{
        height: 60
      }}

      navbar={{
        width: ionnet.showSidebar ? 200 : 0,
        breakpoint: "xs"
      }}
    >
      <AppShell.Header className="
        bg-cream text-black
        dark:bg-black dark:text-white
        py-2">
        <div className="flex items-center justify-between h-full px-10">
          <div className="flex items-center">
            <img src={reactLogo} alt="React logo" className="h-10" />
            <h1 className="ml-5 text-xl">
              Ionnet
            </h1>
          </div>
          <div className="flex items-center">
            <Avatar size="lg" className="ml-5" />
          </div>
        </div>
      </AppShell.Header>
      
      <div className="flex md:flex-row flex-col">
        {
          ionnet.showSidebar && (
            <AppShell.Navbar className="bg-gray-100 dark:bg-gray-800">
              <Stack gap={0}>
                <Link href="/">
                  <Button fullWidth size="compact-lg" variant="light">Websites</Button>
                </Link>
              </Stack>
            </AppShell.Navbar>
          )
        }

        <AppShell.Main className="flex-1">
          <div className="p-5">
            <RouterDisplay />
          </div>
        </AppShell.Main>
      </div>
    </AppShell>
  )
}

export default App
