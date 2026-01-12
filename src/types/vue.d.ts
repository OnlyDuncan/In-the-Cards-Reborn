// Global Vue type declarations

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Add any global properties you might use
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    // Example: if you add global properties to Vue app
    // $myGlobalProperty: string
  }
}
