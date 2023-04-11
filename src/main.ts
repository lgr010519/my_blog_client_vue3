import { createApp } from 'vue'
import './global.less'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueLazyload from "vue-lazyload";
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

const Vue = createApp(App)

Vue.use(router)
// Vue.use(VueLazyload, {
//     preLoad: 1.3,
//     error: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg-blog.csdnimg.cn%2F20210622113522288.gif&refer=http%3A%2F%2Fimg-blog.csdnimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663668150&t=3ff9deb442f8775aff0bf16869b246c3",
//     loading: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg-blog.csdnimg.cn%2F20210622113522288.gif&refer=http%3A%2F%2Fimg-blog.csdnimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663668150&t=3ff9deb442f8775aff0bf16869b246c3",
//     attempt: 1,
// });
Vue.use(mavonEditor)
Vue.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    Vue.component(key, component)
}

Vue.mount('#app')
