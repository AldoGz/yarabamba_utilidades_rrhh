declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_BASE_URL_PROD: string
  readonly VITE_VALIDATE_USER_ENDPOINT: string
  readonly VITE_UPDATE_USER_ENDPOINT: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_PRODUCTION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
