import { createApp } from "vue"

// uno.css
import 'virtual:uno.css'
import './styles'
import App from "./App.vue"
// 使用mock
import useMock from "../mock/index"
// router守卫
import useGuard from "@/router/guard/index"
// 创建pinia
import { installPinia } from "@/store/index"
// 全局注册
import useGlobal from "@/utils/global"
// vue-router
import { installRouter } from "@/router/index"

const app = createApp(App)
installRouter(app)
console.log('app')
installPinia(app)
useGlobal(app)
useGuard()
useMock()
app.mount("#app")
