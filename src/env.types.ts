export enum Env {
  React = 'react',
  Preact = 'preact',
  Next = 'next',
  Unknown = 'unknown',
}

export interface EnvDetails {
  name: Env
  version?: string
}

export function isEnvDetails(value: unknown): value is EnvDetails {
  return typeof value === 'object' && value !== null && 'name' in value
}
