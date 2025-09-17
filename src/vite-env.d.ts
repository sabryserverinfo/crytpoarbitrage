/// <reference types="vite/client" />

// SVG module declarations for Vite asset imports
declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.svg?url' {
  const src: string
  export default src
}
