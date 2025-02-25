import "@mantine/core/styles.css";
import './index.scss'
import React, { StrictMode } from 'react'
// @deno-types="@types/react-dom/client"
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { MantineProvider } from "@mantine/core";
import RouterProvider from "./packages/router/index.tsx";
import Router from "./packages/router/Router.ts";
import { router } from "./routing.tsx";

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <MantineProvider>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </MantineProvider>
  </StrictMode>,
)
