import { createSSRApp } from 'vue'
import App from './App.vue'
import pinia from './stores'
// #ifdef MP-WEIXIN
import mpShareMixin from './mixins/mp-share'
// #endif

export const createApp = (): { app: ReturnType<typeof createSSRApp> } => {
  const app = createSSRApp(App)

  // #ifdef MP-WEIXIN
  app.mixin(mpShareMixin)
  // #endif

  app.use(pinia)
  return {
    app,
  }
}
