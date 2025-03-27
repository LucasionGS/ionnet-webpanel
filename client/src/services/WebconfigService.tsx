import { openModal, closeModal } from "@mantine/modals";
import { type SharedWebconfig } from "../../../shared/SharedWebconfigService.ts";'arp_data'
import { Button } from "@mantine/core";
import NginxService from "./NginxService.tsx";

namespace WebconfigService {
  
  export async function getConfigs(): Promise<SharedWebconfig[]> {
    const response = await fetch("/api/webconfig");
    return (await response.json()).webconfigs;
  }

  export async function getConfig(id: string): Promise<SharedWebconfig> {
    const response = await fetch(`/api/webconfig/${id}`);
    return (await response.json());
  }

  export async function getConfigStatus(id: string): Promise<boolean> {
    const response = await fetch(`/api/webconfig/${id}/status`);
    return (await response.json()).enabled;
  }

  export function promptToggleConfig(website: SharedWebconfig): Promise<SharedWebconfig> {
    return new Promise<SharedWebconfig>((resolve, reject) => {
      const openedId = openModal({
        title: website.enabled ? `Are you sure you want to disable ${website.id}?` : `Are you sure you want to enable ${website.id}?`,
        children: (
          <div>
            <p>{website.enabled ? "Disabling" : "Enabling"} {website.id} will {website.enabled ? "disable" : "enable"} the website.</p>

            <Button.Group
              className="mt-4 m-auto"
            >
              <Button
                variant="default"
                onClick={() => {
                  reject(new Error("User cancelled"));
                  closeModal(openedId);
                }}
              >
                Cancel
              </Button>

              <Button
                color={website.enabled ? "yellow" : "lightgreen"}
                onClick={() => {
                  if (website.enabled) WebconfigService.disableConfig(website.id)
                  else WebconfigService.enableConfig(website.id);
                  
                  website.enabled = !website.enabled;
                  resolve(website);
                  closeModal(openedId);
                }}
              >
                {website.enabled ? "Disable" : "Enable"}
              </Button>

              <Button
                color={website.enabled ? "red" : "green"}
                onClick={() => {
                  if (website.enabled) WebconfigService.disableConfig(website.id)
                  else WebconfigService.enableConfig(website.id);
                  
                  website.enabled = !website.enabled;
                  resolve(website);
                  closeModal(openedId);
                  NginxService.reload({ prompt: true });
                }}
              >
                {website.enabled ? "Disable" : "Enable"} and reload
              </Button>
            </Button.Group>
          </div>
        ),
        onClose: () => {
          reject(new Error("User cancelled"));
        }
      });
    })
  }

  export async function enableConfig(id: string) {
    await fetch(`/api/webconfig/${id}/enable`, { method: "POST" });
  }

  export async function disableConfig(id: string) {
    await fetch(`/api/webconfig/${id}/disable`, { method: "POST" });
  }

  export async function saveConfig(id: string, config: string) {
    await fetch(`/api/webconfig/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ config })
    });
  }
}

export default WebconfigService;