import "@mantine/core/styles.css";
import './index.scss'
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { MantineProvider } from "@mantine/core";
import RouterProvider from "./packages/router/index.tsx";
import Router from "./packages/router/Router.ts";
import { router } from "./routing.tsx";
import { ModalsProvider } from "@mantine/modals";
import IonnetProvider from "./providers/IonnetProvider.tsx";

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <MantineProvider> {/* So */}
      <ModalsProvider> {/* many */}
        <IonnetProvider> {/* providers... */}
          <RouterProvider router={router}>
            <App />
          </RouterProvider>
        </IonnetProvider>
      </ModalsProvider>
    </MantineProvider>
  </StrictMode>,
)
