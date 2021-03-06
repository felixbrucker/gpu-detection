export class OpenclUnavailableError extends Error {
  constructor(message?: string);
}

export type DeviceInfo = {
  id: number;
  name: string;
  vendor: string;
  type: string;
  cores: number;
  memory: string;
}

export type PlatformInfo = {
  id: number;
  name: string;
  version: string;
  devices: [DeviceInfo];
}

export function getPlatformInfo(): [PlatformInfo];
