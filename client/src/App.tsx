import "./App.scss"
import React, { useState } from "react";
import reactLogo from "./assets/react.svg"
import { AppShell, Avatar, Button, Stack, Table, TextInput } from "@mantine/core";
import { useEffect } from "react";
import SharedUser from "../../shared/SharedUser.ts";
import { useTransition } from "react";
import { Link, RouterDisplay } from "./packages/router/index.tsx";
import { type SharedWebconfig } from "../../shared/SharedWebconfigService.ts";
import WebconfigService from "./services/WebconfigService.ts";

function App() {  
  return (
    <AppShell
      header={{
        height: 60
      }}

      navbar={{
        width: 200,
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
        <AppShell.Navbar className="bg-gray-100 dark:bg-gray-800">
          <Stack gap={0}>
            <Link href="/">
              <Button fullWidth size="compact-lg" variant="light">Websites</Button>
            </Link>
          </Stack>
        </AppShell.Navbar>

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
