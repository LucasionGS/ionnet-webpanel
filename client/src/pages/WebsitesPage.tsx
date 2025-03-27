import { useEffect, useState, useTransition } from 'react'
import { Button, Group, Loader, Table, TextInput } from "@mantine/core";
import WebconfigService from "../services/WebconfigService.tsx";
import type { SharedWebconfig } from "../../../shared/SharedWebconfigService.ts";
import PageTransition from "../components/PageTransition.tsx";
import { useForceUpdate } from "@mantine/hooks";
import { Link } from "../packages/router/index.tsx";
import useUser from "../hooks/useUser.tsx";
import NginxGlobalActions from "../components/NginxGlobalActions/NginxGlobalActions.tsx";

export default function WebsitesPage() {
  const { user } = useUser();

  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [initialConfigItems, setInitialConfigItems] = useState<SharedWebconfig[]>([]);
  const [configItems, setConfigItems] = useState<SharedWebconfig[]>(null!);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    WebconfigService.getConfigs().then(configs => {
      setInitialConfigItems(configs);
      setConfigItems(configs);
    });
  }, []);
  
  useEffect(() => {
    startTransition(() => {
      setConfigItems(
        initialConfigItems
        .filter(c => c.id.toLowerCase().includes(search.toLowerCase()))
      );
    });
  }, [search, initialConfigItems]);

  if (!configItems) return null;
  
  return (
    <PageTransition>
      <Group>
        <h2 className="text-2xl">Websites</h2>
        <NginxGlobalActions />
      </Group>
      <p>
        {user && `Hello, ${user.username}!`}
      </p>
      
      <Table striped className="mt-5" style={{
        tableLayout: "fixed"
      }} withTableBorder stickyHeader stickyHeaderOffset={60}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <TextInput
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search"
                className="w-full"
                rightSection={
                  isPending && (
                    <Loader />
                  )
                }
              />
            </Table.Th>
            <Table.Th></Table.Th>
            <Table.Th></Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>State</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th>Updated</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {configItems.map((website, index) => (
            <Table.Tr key={index}>
              <Table.Td>
                <Link href={`/website/${website.id}`}>{website.id}</Link>
              </Table.Td>
              <Table.Td>
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
              </Table.Td>
              <Table.Td>{new Date(website.created).toLocaleString()}</Table.Td>
              <Table.Td>{new Date(website.updated).toLocaleString()}</Table.Td>
            </Table.Tr>
          ))}
          
        </Table.Tbody>
      </Table>
    </PageTransition>
  )
}
