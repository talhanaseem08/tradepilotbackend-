/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  /** Google Cloud OAuth 2.0 Web client ID (same as gateway GOOGLE_CLIENT_ID). */
  readonly VITE_GOOGLE_CLIENT_ID?: string
  /** Set to "false" in local dev when the OAuth client has not allow-listed this origin. */
  readonly VITE_GOOGLE_SIGNIN_ENABLED?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
