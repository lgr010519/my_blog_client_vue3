<script lang="ts" setup>
import {getArticles} from "../api/articles";
import moment from "moment"
import {computed, defineEmits, defineProps, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {Search} from "@element-plus/icons-vue";

const router = useRouter()

const props = defineProps({
	open: Boolean
})

const emit = defineEmits(['toggle'])

const openModal = computed({
	get() {
		return props.open;
	},
	set(val) {
		clear(val);
	}
})

const keywords = ref([])
const keyword = ref('')
const list = ref([])
let timer: string | number | NodeJS.Timeout | null | undefined = null

const clear = (val: boolean) => {
	keyword.value = "";
	emit("toggle", val);
	list.value = [];
}

const handleSearch = () => {
	if (timer) clearTimeout(timer) // 防抖
	timer = setTimeout(async () => {
		const res: any = await getArticles({
			title: keyword.value.trim(),
			page: 1,
			pageSize: 9999,
			status: 1,
			publishStatus: 1,
		})
		if (res.code === 200) {
			const handleRes = res.data.list
			handleRes.map((item: { createTime: any; title: string; }) => {
				item.createTime = moment(item.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')
				const lowerCaseTitle = item.title.toLowerCase()
				const index = lowerCaseTitle.indexOf(keyword.value.toLowerCase())
				const sliceStr = item.title.slice(index, index + keyword.value.length)
				item.title = item.title.replace(sliceStr, `<strong style="color: rgb(33,150,243);">${sliceStr}</strong>`)
			})
			list.value = handleRes
		}
	}, 500)
}

const goDetail = (item: { _id: any; }) => {
	clear(false);
	router.push({
		name: "articlesDetails",
		query: {id: item._id}
	});
}

watch(() => openModal, (newVal) => {
	if (newVal) {
		handleSearch()
	}
})
</script>

<template>
	<div>
		<el-dialog width="60%" :open.sync="openModal">
			<slot name="title">
				<el-input
					:suffix-icon="Search"
					:data="keywords"
					label="文章搜索"
					v-model="keyword"
					@input="handleSearch"
					:action-click="handleSearch"
					autofocus
				>
					<template #suffix>
						<el-icon class="el-input__icon">
							<search/>
						</el-icon>
					</template>
					<!--					<template slot-scope="scope">-->
					<!--						<mu-list-item-action>-->
					<!--							<mu-avatar color="primary">{{ scope.item.substring(0, 1) }}</mu-avatar>-->
					<!--						</mu-list-item-action>-->
					<!--						<mu-list-item-content v-html="scope.highlight"></mu-list-item-content>-->
					<!--					</template>-->
				</el-input>
				<div>
					<span style="color: var(--el-color-primary);">{{ keywords.item.substring(0, 1) }}</span>
					<div v-html="keywords.highlight"></div>
				</div>
			</slot>
			<div v-if="list && list.length === 0" class="no-content">暂无内容</div>
			<div v-else class="list">
				<div :key="item._id" v-for="item in list" @click="goDetail(item)">
					<div>
						<el-avatar :src="item.cover"/>
					</div>
					<div style="width: 693px;">
						<div v-html="item.title"></div>
						<div>
							<span>{{ item.introduction }}</span>
						</div>
					</div>
					<div style="width: 92px;text-align: center;">
						{{ item.createTime }}
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<style lang="less" scoped>
.list {
	overflow-y: auto;
	max-height: 450px;
	
	&::-webkit-scrollbar {
		width: 8px;
	}
	
	&::-webkit-scrollbar-thumb {
		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		background: rgba(0, 0, 0, 0.2);
		
		&:hover {
			background: rgba(0, 0, 0, 0.3);
		}
	}
	
	&::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0);
		border-radius: 10px;
		background: rgba(0, 0, 0, 0);
	}
}

.no-content {
	text-align: center;
}

@media screen and (max-width: 750px) {
	.close {
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
	}
}

@media screen and (min-width: 750px) {
	.close {
		display: none;
	}
}
</style>