
import uma from 'umtrack-wx'
uma.init({
  appKey: '6986e1a19a7f37648858d9ef',
  useOpenid: true,
  autoGetOpenid: true,
  debug: false
})


import { createSSRApp } from "vue";
import App from "./App.vue";

export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
