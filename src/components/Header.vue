<script setup>
import RegisterForm from "../components/RegisterForm.vue";
import LoginForm from "../components/LoginForm.vue";
import SearchForm from "../components/SearchForm.vue";
import {logout} from "../api/loginRegister";
import {computed, defineProps, onMounted, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import avatarBg from '../assets/avatarBg.png'
import {HomeFilled, Document, Files, Operation, Promotion, Avatar} from '@element-plus/icons-vue'
import {useDark, useToggle} from '@vueuse/core'

const route = useRoute()
const router = useRouter()

const isDark = useDark({
	// 存储到localStorage/sessionStorage中的Key 根据自己的需求更改
	storageKey: 'theme',
	// 暗黑class名字
	valueDark: 'dark',
	// 高亮class名字
	valueLight: 'light',
})
const toggle = useToggle(isDark)

const menus = reactive([
	{
		name: "首页",
		router: "home",
		icon: HomeFilled,
	},
	{
		name: "文章",
		router: "articles",
		icon: Document,
	},
	{
		name: "归档",
		router: "archives",
		icon: Files,
	},
	{
		name: "分类",
		router: "categories",
		icon: Operation,
	},
	{
		name: "标签",
		router: "tags",
		icon: Promotion,
	},
	{
		name: "关于",
		router: "about",
		icon: Avatar,
	},
])
const props = defineProps({
	lightIndex: Number,
	background: String
})
const openUser = ref(false)
const openTheme = ref(false)
const info = reactive({
	menu: menus,
	login: true, // 是否开启登录
	openSearch: true,// 是否开启搜索
	register: true,// 是否开启注册
})
const showToolBtn = ref(true)
const openSearchModal = ref(false)
const openLoginModal = ref(false)
const openRegisterModal = ref(false)
const showBackTop = ref(false)
const currentTheme = ref(localStorage.getItem('theme'))
const userInfo = JSON.parse(localStorage.getItem("userInfo")) // 用户信息
const isShowAction = computed(() => {
	return !(
		!info.openSearch &&
		!info.register &&
		!info.login
	);
})

onMounted(() => {
	showToolBtn.value = !userInfo
	window.onscroll = () => {
		showBackTop.value = document.documentElement.scrollTop + document.body.scrollTop > 100;
	}
	window.onkeydown = (event) => {
		if (event.ctrlKey && event.key === 'f') {
			event.preventDefault()
			openSearchModal.value = true
		}
	}
})

// 路由跳转
const go = (item) => {
	// 点击相同路由不跳转
	if (route.name === item.router) return
	router.push({
		name: item.router
	})
}

const toggleRegisterModal = (bool) => {
	openRegisterModal.value = bool;
}

const toggleLoginModal = (bool) => {
	openLoginModal.value = bool;
}

const toggleSearchModal = (bool) => {
	openSearchModal.value = bool;
}

const scrollTop = () => {
	document.body.scrollIntoView({
		block: 'start',
		behavior: 'smooth'
	})
}

const toggleTheme = (myTheme) => {
	currentTheme.value = myTheme
	if (myTheme === 'light') {
		toggle(false)
	} else {
		toggle(true)
	}
	openTheme.value = false
}

const handleLogout = async () => {
	const res = await logout()
	if (res.code === 200) {
		ElMessage({
			message: res.msg,
			type: 'success'
		})
		localStorage.removeItem('userInfo')
		if (route.path !== '/home') {
			await router.push('/home')
		}
		location.reload()
	} else {
		ElMessage({
			message: '退出登录失败，请重试',
			type: 'error'
		})
	}
}

const goDetail = () => {
	router.push('/user')
}
</script>

<template>
	<div class="header">
		<el-menu class="header-menu" :background-color="props.background">
			<el-avatar :src="userInfo?userInfo.avatar:avatarBg" :size="40" class="header-avatar" @click="goDetail"/>
			<!--       tab栏-->
			<div class="button-group">
				<el-button link @click="go(item)" class="tab" v-for="(item,index) in info.menu"
				           :key="item.name"
				           :type="props.lightIndex===index?'primary':''">
					<el-icon size="16" style="margin-right: 4px;">
						<component :is="item.icon"/>
					</el-icon>
					{{ item.name }}
				</el-button>
				<!--       主题切换-->
				<el-dropdown size="large" class="header-dropdown">
					<el-button link class="el-dropdown-link">
						<el-icon size="18" v-if="currentTheme === 'light'">
							<Sunny/>
						</el-icon>
						<el-icon size="18" v-else>
							<Moon/>
						</el-icon>
					</el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item @click="toggleTheme('light')">
								<el-icon size="16" :color="currentTheme === 'light' ? 'rgb(64,158,255)' : ''">
									<Sunny/>
								</el-icon>
							</el-dropdown-item>
							<el-dropdown-item @click="toggleTheme('auto')">
								<el-icon size="16" :color="currentTheme === 'auto' ? 'rgb(64,158,255)' : ''">
									<Moon/>
								</el-icon>
							</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
				<!--       用户操作-->
				<el-dropdown class="header-dropdown" v-if="userInfo">
					<el-button link class="el-dropdown-link" @click="openUser = !openUser">
						{{ userInfo?.nickName }}
						<el-icon class="el-icon--right">
							<arrow-down/>
						</el-icon>
					</el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item @click="router.push({name: 'user'})">
								个人中心
							</el-dropdown-item>
							<el-dropdown-item @click="handleLogout">
								退出登录
							</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</el-menu>
		<!-- 搜索按钮 -->
		<div class="tool" v-if="isShowAction">
			<!-- 如果用户已经登录了那就不展示登录和注册按钮 !userInfo 控制 -->
			<div v-if="info.login && !userInfo" class="tool-row">
				<transition name="fade">
					<el-button
						class="tool-button"
						v-show="showToolBtn"
						@click="openLoginModal = true;showToolBtn = false;"
						type="primary"
					>
						登录
					</el-button>
				</transition>
			</div>
			<div class="tool-row">
				<el-tooltip placement="right" :content="userInfo?'搜索 (Ctrl + F)':'登录 / 注册 / 搜索 (Ctrl + F)'">
					<el-button
						class="tool-button search-fab"
						@click="showToolBtn = !showToolBtn"
						type="primary"
					>
						<el-icon size="30">
							<SwitchFilled/>
						</el-icon>
					</el-button>
				</el-tooltip>
				<transition name="fade">
					<el-button
						class="tool-button"
						v-show="showToolBtn && info.openSearch"
						@click="openSearchModal = true;showToolBtn = false;"
						type="danger"
					>
						搜索
					</el-button>
				</transition>
			</div>
			<!-- 如果用户已经登录了那就不展示登录和注册按钮 !userInfo 控制 -->
			<div v-if="info.register && !userInfo" class="tool-row">
				<transition name="fade">
					<el-button
						class="tool-button"
						v-show="showToolBtn"
						@click="openRegisterModal = true;showToolBtn = false;"
						type="warning"
					>
						注册
					</el-button>
				</transition>
			</div>
		</div>
		<RegisterForm
			:open="openRegisterModal"
			@toggle="toggleRegisterModal"
			@toLogin="toggleLoginModal"
		></RegisterForm>
		<LoginForm
			:open="openLoginModal"
			@toggle="toggleLoginModal"
		></LoginForm>
		<SearchForm
			:open="openSearchModal"
			@toggle="toggleSearchModal"
		></SearchForm>
		<transition>
			<el-tooltip placement="top" content="返回顶部">
				<el-button v-show="showBackTop" @click="scrollTop" class="back-top" type="info">
					<Top/>
				</el-button>
			</el-tooltip>
		</transition>
	</div>
</template>

<style lang="less" scoped>
.header {
	position: fixed;
	z-index: 1501;
	top: 0;
	left: 0;
	width: 100%;
	
	.header-menu {
		width: 100%;
		height: 64px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border: 0;
		box-shadow: 0 2px 4px -1px rgb(0 0 0 / 20%), 0 4px 5px 0 rgb(0 0 0 / 14%), 0 1px 10px 0 rgb(0 0 0 / 12%);
	}
	
	.button-group {
		display: inline-block;
		float: right;
		
		.tab {
			height: 64px;
			padding: 0 8px;
		}
		
		.header-dropdown {
			height: 64px;
			padding: 0 8px;
		}
	}
	
	.header-avatar {
		float: left;
		margin-left: 20px;
		cursor: pointer;
		transform: scale(1.0);
		transition: all 0.2s;
		
		&:hover {
			transform: scale(1.3);
			transition: all 0.2s;
		}
	}
}

.tool {
	position: fixed;
	left: 0;
	bottom: 2.66667rem;
	
	.tool-row {
		margin-top: 20px;
		height: 60px;
		
		.tool-button {
			width: 60px;
			height: 60px;
			border-radius: 50%;
		}
		
		.search-fab {
			margin-left: -30px;
		}
	}
}

.back-top {
	position: fixed;
	right: 26px;
	bottom: 20px;
	background: #595959;
}

@media screen and (max-width: 750px) {
	.tab {
		display: none;
	}
}

@media screen and (min-width: 750px) {
	.mobileMenu {
		display: none;
	}
}

/deep/ .mu-button {
	text-transform: lowercase;
}

.flex-grow {
	flex-grow: 1;
}

.el-dropdown-link {
	cursor: pointer;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}

.fade-enter-from,
.fade-leave-to {
	/*定义进入开始和离开结束的透明度为0*/
	opacity: 0;
	transform: translateX(-100px);
}

.fade-enter-to,
.fade-leave-from {
	/*定义进入结束和离开开始的透明度为1*/
	opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
	/*定义进入和离开过渡状态的透明度变化的时间和变化曲线*/
	transition: all .3s;
}
</style>