export interface APIConfig {
  baseUrl: string
  isCoreDev: boolean
  getUrl: (path: string) => string
}

export const defaultConfig: APIConfig = {
  baseUrl: 'https://tndevs.com',
  isCoreDev: false,
  getUrl: (path: string) => `https://tndevs.com${path}`
}