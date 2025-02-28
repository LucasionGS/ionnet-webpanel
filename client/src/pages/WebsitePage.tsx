import { useEffect, useState, useTransition } from 'react'
import { Button, Table, Textarea, TextInput } from "@mantine/core";
import WebconfigService from "../services/WebconfigService.ts";
import type { SharedWebconfig } from "../../../shared/SharedWebconfigService.ts";
import PageTransition from "../components/PageTransition.tsx";
import { useForceUpdate } from "@mantine/hooks";
import { Link } from "../packages/router/index.tsx";
import useUser from "../hooks/useUser.tsx";

export default function WebsitePage(props: { id: string }) {
  const { user } = useUser();

  const [website, setWebsite] = useState<SharedWebconfig | null>(null);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    WebconfigService.getConfig(props.id).then(setWebsite);
  }, []);
  
  if (!website) return null;
  
  return (
    <PageTransition>
      <h2 className="text-2xl">{website.id}</h2>
      <Button
        size="xs"
        variant={website.enabled ? "filled" : "light"}
        color={website.enabled ? "teal" : "gray"}
        onClick={() => {
          if (website.enabled) WebconfigService.disableConfig(website.id)
          else WebconfigService.enableConfig(website.id);

          website.enabled = !website.enabled;
          forceUpdate();
        }}
      >
        {website.enabled ? "Enabled" : "Disabled"}
      </Button>
      <Textarea
        autosize
        value={website.config}
        onChange={(event) => {
          setWebsite({ ...website, config: event.currentTarget.value });
          forceUpdate();
        }}
        styles={{
          input: {
            width: "100%",
            fontFamily: "monospace",
            fontSize: "1rem",
          }
        }}
      ></Textarea>
    </PageTransition>
  )
}
