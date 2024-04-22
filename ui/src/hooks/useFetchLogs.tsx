import { useState, useEffect } from "react"
import { v1 } from "@docker/extension-api-client-types"
import { Container, Log } from "../types"

const ARGUMENTS = ['--details', '--timestamps']

export default function useFetchLogs(client: v1.DockerDesktopClient, containers: Container[]) {

  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const fetchContainerLogs = async (containerId: string) => {
      const result = await client.docker.cli.exec(`logs ${containerId}`, ARGUMENTS)
      return result.lines()
    }

    const fetchLogs = async () => {
      const containersLogs = containers.map(async (container) => {
        const lines = await fetchContainerLogs(container.Id)

        return lines.map(line => {
          const [timestamp] = line.split(' ')
          const message = line.substring(timestamp.length + 1)
          return {
            containerId: container.Id,
            timestamp: new Date(timestamp),
            message,
          }
        })
      })

      const allLogs = await Promise.all(containersLogs);

      setLogs(prev => [...prev, ...allLogs.flat()])
    }

    fetchLogs().catch(console.error)
  }, [client, containers])

  return {
    logs
  }
}
