/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  
  const component: DefineComponent<object, object, unknown>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string
  readonly VITE_WEBVIEW_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
