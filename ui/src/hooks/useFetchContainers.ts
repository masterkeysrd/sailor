import { useState, useEffect } from "react"
import { v1 } from "@docker/extension-api-client-types"
import { Container } from "../types"

export default function useFetchContainers(client: v1.DockerDesktopClient) {
  const [containers, setContainers] = useState<Container[]>([])


  useEffect(() => {
    const fetchContainers = async () => {
      const result = await client.docker.listContainers({ all: true }) as Container[];

      setContainers(result)
    }

    fetchContainers().catch(console.error)
  }, [client])

  return {
    containers
  }
}
