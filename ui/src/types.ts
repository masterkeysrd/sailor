export type Container = {
  Id: string;
  Names: string[];
  Image: string;
  ImageID: string;
  Command: string;
  Created: number;
  Ports: ContainerPorts[];
  Labels: Record<string, string>
  State: ContainerState;
  Status: string;
}

export type ContainerPorts = {
  IP: string;
  PrivatePort: number;
  PublicPort: number;
  Type: string
}

export type ContainerState = 'running' | 'exited';

export type Log = {
  containerId: string;
  timestamp: Date;
  message: string
}
