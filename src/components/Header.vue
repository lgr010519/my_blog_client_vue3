<script lang="ts" setup>
import RegisterForm from "../components/RegisterForm.vue";
import LoginForm from "../components/LoginForm.vue";
import SearchForm from "../components/SearchForm.vue";
import {logout} from "../api/loginRegister";
import {computed, defineProps, onMounted, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {ElMessage} from "element-plus";

const route = useRoute()
const router = useRouter()
const menus = [
	{
		name: "首页",
		router: "home",
		icon: "home",
	},
	{
		name: "文章",
		router: "articles",
		icon: "note_add",
	},
	{
		name: "归档",
		router: "archives",
		icon: "drafts",
	},
	{
		name: "分类",
		router: "categories",
		icon: "dns",
	},
	{
		name: "标签",
		router: "tags",
		icon: "loyalty",
	},
	{
		name: "关于",
		router: "about",
		icon: "perm_identity",
	},
]
const props = defineProps({
	lightIndex: Number,
	background: String
})
const openUser = ref(false)
const openTheme = ref(false)
const openMobileMenu = ref(false)
const triggerUser = ref(null)
const trigger = ref(null)
const triggerTheme = ref(null)
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
const currentTheme = ref('')
const theme = ref(null)
const user = ref(null)
const avatarBg = '../../assets/avatarBg.png'
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
	triggerTheme.value = theme.$el;
	triggerUser.value = user.$el;
	window.onscroll = () => {
		showBackTop.value = document.documentElement.scrollTop + document.body.scrollTop > 100;
	}
	window.onkeydown = (event) => {
		if (event.ctrlKey && event.key === 'f') {
			event.preventDefault()
			openSearchModal.value = true
		}
	}
	const hours = new Date().getHours()
	let defaultTheme = ''
	if (hours >= 8 && hours <= 18) {
		defaultTheme = 'selfLight'
	} else {
		defaultTheme = 'selfDark'
	}
	currentTheme.value = localStorage.getItem('theme') || defaultTheme
})

// 路由跳转
const go = (item: { router: any; }) => {
	// 点击相同路由不跳转
	if (route.name === item.router) return
	router.push({
		name: item.router
	})
}

const toggleRegisterModal = (bool: boolean) => {
	openRegisterModal.value = bool;
}

const toggleLoginModal = (bool: boolean) => {
	openLoginModal.value = bool;
}

const toggleSearchModal = (bool: boolean) => {
	openSearchModal.value = bool;
}

const scrollTop = () => {
	document.body.scrollIntoView({
		block: 'start',
		behavior: 'smooth'
	})
}

const toggleTheme = (myTheme: string) => {
	theme.value.use(myTheme)
	currentTheme.value = myTheme
	localStorage.setItem('theme', myTheme)
	openTheme.value = false
}

const handleLogout = async () => {
	const res: any = await logout()
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
		<el-menu :color="props.background">
			<el-avatar :src="userInfo?userInfo.avatar:avatarBg" :size="40" class="header-avatar" @click="goDetail"/>
			<div class="flex-grow"/>
			<!--       tab栏-->
			<el-button @click="go(item)" class="tab" v-for="(item,index) in info.menu"
			           :key="item.name"
			           :color="props.lightIndex===index?'#2195f2':''">
				<el-icon size="16" :value="item.icon"></el-icon>
				{{ item.name }}
			</el-button>
			<!--       主题切换-->
			<el-button ref="theme" @click="openTheme = !openTheme">
				<el-icon value="color_lens"></el-icon>
			</el-button>
			<el-dropdown>
				<div class="el-dropdown-link">
					<el-icon v-if="currentTheme === 'selfLight'" :color="currentTheme === 'selfLight' ? 'primary' : ''">
						<Sunny/>
					</el-icon>
					<el-icon v-else :color="currentTheme === 'selfDark' ? 'primary' : ''">
						<Moon/>
					</el-icon>
				</div>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item @click="toggleTheme('selfLight')">
							<Sunny/>
						</el-dropdown-item>
						<el-dropdown-item @click="toggleTheme('selfDark')">
							<Moon/>
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
			<!--       用户操作-->
			<el-dropdown>
				<div class="el-dropdown-link">
					{{ userInfo?.nickName }}
					<el-icon class="el-icon--right">
						<arrow-down/>
					</el-icon>
				</div>
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
		</el-menu>
		<!-- 搜索按钮 -->
		<div class="tool" v-if="isShowAction">
			<!-- 如果用户已经登录了那就不展示登录和注册按钮 !userInfo 控制 -->
			<div v-if="info.login && !userInfo" class="tool-row">
				<transition>
					<el-button
						v-show="showToolBtn"
						@click="openLoginModal = true;showToolBtn = false;"
						type="primary"
						circle
					>
						登录
					</el-button>
				</transition>
			</div>
			<div class="tool-row">
				<el-tooltip placement="right" :content="userInfo?'搜索 (Ctrl + F)':'登录 / 注册 / 搜索 (Ctrl + F)'">
					<el-button
						@click="showToolBtn = !showToolBtn"
						type="info"
						class="search-fab"
					>
						<Search/>
					</el-button>
				</el-tooltip>
				<transition>
					<el-button
						v-show="showToolBtn && info.openSearch"
						@click="openSearchModal = true;showToolBtn = false;"
						type="error"
					>
						搜索
					</el-button>
				</transition>
			</div>
			<!-- 如果用户已经登录了那就不展示登录和注册按钮 !userInfo 控制 -->
			<div v-if="info.register && !userInfo" class="tool-row">
				<transition>
					<el-button
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
	width: 100%;
	top: 0;
	
	.header-avatar {
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
		height: 56px;
		
		.search-fab {
			margin-left: -28px;
			margin-right: 20px;
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
</style>