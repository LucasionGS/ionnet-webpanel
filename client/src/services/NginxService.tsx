import { openModal } from "@mantine/modals";

namespace NginxService {
  
  export async function restart(opts?: { prompt: boolean }): Promise<boolean> {
    const response = await fetch("/api/nginx/restart");
    const data = await response.json();
    if (!response.ok) {
      if (opts?.prompt) openModal({
        title: "Error",
        children: (
          <div>
            <p>{data.error ? data.error : "Failed to restart Nginx"}</p>
          </div>
        )
      });
      throw new Error(data.error ? data.error : "Failed to restart Nginx");
    }

    if (opts?.prompt) openModal({
      title: "Nginx Restarted",
      children: (
        <div>
          <p>Nginx has been restarted successfully.</p>
        </div>
      )
    });
    
    return data.success;
  }

  export async function reload(opts?: { prompt: boolean }): Promise<boolean> {
    const response = await fetch("/api/nginx/reload");
    const data = await response.json();
    if (!response.ok) {
      if (opts?.prompt) openModal({
        title: "Error",
        children: (
          <div>
            <p>{data.error ? data.error : "Failed to reload Nginx"}</p>
          </div>
        )
      });
      throw new Error(data.error ? data.error : "Failed to reload Nginx");
    }

    if (opts?.prompt) openModal({
      title: "Nginx Reloaded",
      children: (
        <div>
          <p>Nginx has been reloaded successfully.</p>
        </div>
      )
    });
    
    return data.success;
  }
}

export default NginxService;