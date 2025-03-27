import React, { useState } from 'react'
import { Button } from "@mantine/core";
import { openModal } from "@mantine/modals";
import NginxService from "../../services/NginxService.tsx";

export default function NginxGlobalActions() {
  const [restarting, setRestarting] = useState(false);
  const [reloading, setReloading] = useState(false);

  const anyActionInProgress = restarting || reloading;
  
  return (
    <Button.Group
      className="ml-auto"
    >
      <Button
        color="yellow"
        onClick={() => {
          setRestarting(true);
          NginxService.restart({ prompt: true }).then(_success => setRestarting(false)).catch(_err => setRestarting(false));
        }}
        disabled={anyActionInProgress}
        loading={restarting}
      >
        Restart
      </Button>

      <Button
        color="yellow"
        onClick={() => {
          setReloading(true);
          NginxService.reload({ prompt: true }).then(_success => setReloading(false)).catch(_err => setReloading(false));
        }}
        disabled={anyActionInProgress}
        loading={reloading}
      >
        Reload
      </Button>
    </Button.Group>
  )
}
