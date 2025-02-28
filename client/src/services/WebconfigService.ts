import { type SharedWebconfig } from "../../../shared/SharedWebconfigService.ts";

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

  export async function enableConfig(id: string) {
    await fetch(`/api/webconfig/${id}/enable`, { method: "POST" });
  }

  export async function disableConfig(id: string) {
    await fetch(`/api/webconfig/${id}/disable`, { method: "POST" });
  }
}

export default WebconfigService;