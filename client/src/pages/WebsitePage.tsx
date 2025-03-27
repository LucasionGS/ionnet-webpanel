import { useCallback, useEffect, useState } from 'react'
import { Button, Group } from "@mantine/core";
import WebconfigService from "../services/WebconfigService.tsx";
import type { SharedWebconfig } from "../../../shared/SharedWebconfigService.ts";
import PageTransition from "../components/PageTransition.tsx";
import { useForceUpdate } from "@mantine/hooks";
import { Link, useRoute } from "../packages/router/index.tsx";
import useUser from "../hooks/useUser.tsx";
import { Editor } from "@monaco-editor/react";

let globalSave: () => void;
export default function WebsitePage(props: { id: string }) {
  const { user: _ } = useUser();
  const route = useRoute();

  const [website, setWebsite] = useState<SharedWebconfig | null>(null);
  const [configContent, _setConfigContent] = useState("");
  const [changed, setChanged] = useState(false);
  const setConfigContent = (value: string) => { _setConfigContent(value); setChanged(true); }
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    WebconfigService.getConfig(props.id).then(s => {
      setWebsite(s);
      _setConfigContent(s?.config || '');
    });
  }, []);

  globalSave = useCallback(() => {
    if (website && changed) {
      setChanged(false);
      WebconfigService.saveConfig(website.id, configContent)
      .catch(() => {
        setChanged(true);
      });
    }
  }, [website, changed, configContent]);

  useEffect(() => {
    route.enableExitWarning(changed);
  }, [changed]);
  
  if (!website) return null;
  
  return (
    <PageTransition>
      <Group>
        <Link href="/">
          <Button variant="subtle" size="xs">Back</Button>
        </Link>
        <h2 className="text-2xl">{website.id}</h2>
        <a href={`http://${website.id}`} target="_blank" rel="noreferrer">
          <Button variant="subtle" size="xs">Go</Button>
        </a>
      </Group>
      <Button.Group>
        <Button
          size="xs"
          variant={website.enabled ? "filled" : "light"}
          color={website.enabled ? "teal" : "gray"}
          onClick={() => {
            WebconfigService.promptToggleConfig(website).then(() => forceUpdate());
          }}
        >
          {website.enabled ? "Enabled" : "Disabled"}
        </Button>
        <Button
          size="xs"
          variant="filled"
          color="teal"
          onClick={() => {
            // Convert between managed and custom
          }}
          >
          {website.managed ? "Managed" : "Custom"}
        </Button>
        {
          changed && (
            <Button
              size="xs"
              variant="filled"
              color="cyan"
              onClick={() => {
                globalSave();
              }}
            >
              Save
            </Button>
          )
        }
      </Button.Group>
      <div className="mt-5 border border-solid border-gray-200 rounded-lg">
        {/* @ts-ignore */}
        <Editor
          height="60vh"
          defaultLanguage="shell"
          value={configContent}
          onChange={(value) => {
            setConfigContent(value || "");
            forceUpdate();
          }}
          options={{
            minimap: { enabled: true },
            fontSize: 16,
            fontFamily: "monospace",
          }}
          onMount={(editor, monaco) => {
            editor.focus();

            editor.addAction({
              id: 'save',
              label: 'Save',
              keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
              contextMenuGroupId: 'navigation',
              contextMenuOrder: 1,
              run: () => {
                globalSave();
              }
            })
          }}
        />
      </div>
    </PageTransition>
  )
}
