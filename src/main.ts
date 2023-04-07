import { createApp } from 'vue'
import './global.less'
import App from './App.vue'
import router from './router'
import 'muse-ui/lib/styles/base.less';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {
    Button,
    Select,
    AppBar,
    Icon,
    Menu,
    List,
    Popover,
    Avatar,
    BottomSheet,
    Paper,
    Pagination,
    Chip,
    Card,
    Carousel,
    Tooltip,
    TextField,
    Dialog,
    Snackbar,
    Divider,
    Badge,
    Form,
    AutoComplete
} from 'muse-ui';
import 'muse-ui/lib/styles/theme.less';
import Toast from 'muse-ui-toast';
import Helpers from 'muse-ui/lib/Helpers';
import VueLazyload from "vue-lazyload";
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

const Vue = createApp(App)

Vue.use(router)
Vue.use(Button);
Vue.use(Select);
Vue.use(AppBar);
Vue.use(Icon);
Vue.use(Menu);
Vue.use(List);
Vue.use(Popover);
Vue.use(Avatar);
Vue.use(BottomSheet);
Vue.use(Paper);
Vue.use(Pagination);
Vue.use(Chip);
Vue.use(Card);
Vue.use(Carousel);
Vue.use(Tooltip);
Vue.use(TextField);
Vue.use(Dialog);
Vue.use(Snackbar);
Vue.use(Divider);
Vue.use(Badge);
Vue.use(Form);
Vue.use(AutoComplete);
Vue.use(Toast, {
    position: "top", // 弹出的位置
    time: 2000, // 显示的时长
    closeIcon: "close", // 关闭的图标
    close: true, // 是否显示关闭按钮
    successIcon: "check_circle", // 成功信息图标
    infoIcon: "info", // 信息信息图标
    warningIcon: "priority_high", // 提醒信息图标
    errorIcon: "warning", // 错误信息图标
});
Vue.use(Helpers);
Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg-blog.csdnimg.cn%2F20210622113522288.gif&refer=http%3A%2F%2Fimg-blog.csdnimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663668150&t=3ff9deb442f8775aff0bf16869b246c3",
    loading: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg-blog.csdnimg.cn%2F20210622113522288.gif&refer=http%3A%2F%2Fimg-blog.csdnimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663668150&t=3ff9deb442f8775aff0bf16869b246c3",
    attempt: 1,
});
Vue.use(mavonEditor)
Vue.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    Vue.component(key, component)
}

Vue.mount('#app')
