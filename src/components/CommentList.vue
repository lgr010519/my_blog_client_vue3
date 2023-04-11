<script lang="ts" setup>
import {comment} from "../api/comment";
import {defineProps, reactive, ref} from "vue";
import {ElMessage} from 'element-plus'

const props = defineProps({
	list: Array,
	articleId: String,
	articleTitle: String,
	classStyle: String,
	prevWho: String
})
const user = JSON.parse(localStorage.getItem("userInfo"))
const open = ref(false)
const replayContent = ref('')
const modalTitle = ref('')
const itemObj = reactive({
	item: {
		_id: '',
		currentReplayContent: '',
	}
})

const replay = (item: { nickName: any; _id: string; currentReplayContent: string }) => {
	if (!user) {
		ElMessage("登录才能评论哦~");
		return;
	}
	itemObj.item = item
	open.value = true;
	modalTitle.value = `回复 @${item.nickName}`;
}

const close = () => {
	open.value = false;
	replayContent.value = "";
}

const ok = async () => {
	if (!replayContent.value) {
		ElMessage("请输入回复内容");
		return;
	}
	const res: any = await comment({
		targetReplayId: itemObj.item._id,
		targetReplayContent: itemObj.item.currentReplayContent,
		currentReplayContent: replayContent.value,
		avatar: user.avatar,
		email: user.email,
		nickName: user.nickName,
		articleId: props.articleId,
		articleTitle: props.articleTitle,
	})
	if (res.code === 200) {
		ElMessage({
			message: '回复成功',
			type: 'success'
		})
		open.value = false;
		location.reload()
	}
}
</script>

<template>
	<div class="comment-list">
		<div class="comment-item">
			<el-card
				class="card mobile-card"
				:class="classStyle"
				v-for="item in list"
				:key="item._id"
			>
				<template #header>
					<div class="card-header">
						<el-avatar :size="50" :src="item.avatar"/>
						<span>{{ item.nickName }}</span>
						<span>{{ item.commentTime }}</span>
					</div>
				</template>
				<span v-if="prevWho" class="who">@{{ prevWho }}</span>
				<div>
					{{ item.currentReplayContent }}
				</div>
				<!--          <mu-badge-->
				<!--            v-if="item.auditStatus == 3"-->
				<!--            content="未审核"-->
				<!--            color="#ccc"-->
				<!--          ></mu-badge>-->
				<div v-if="user && user.nickName !== item.nickName && user.email !== item.email">
					<el-button @click="replay(item)" color="primary">回复</el-button>
				</div>
				
				<!-- 递归组件 调用自身，必须指定name属性commentList -->
				<div v-if="item.children">
					<comment-list
						:prevWho="item.nickName"
						classStyle="sub-card"
						:articleId="articleId"
						:articleTitle="articleTitle"
						:list="item.children"
					></comment-list>
				</div>
			</el-card>
		</div>
		
		<el-dialog
			:title="modalTitle"
			width="600"
			max-width="80%"
			v-model="open"
		>
			<el-input
				type="textarea"
				class="comment-input"
				placeholder="说点什么..."
				:rows="4"
				v-model="replayContent"
			></el-input>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="close">取消</el-button>
					<el-button type="primary" @click="ok">确定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<style lang="less" scoped>
.comment-item {
	padding-bottom: 0.53333rem;
	
	/deep/ .mu-card-text {
		padding-top: 0;
		
		.who {
			color: #e91e63;
		}
	}
}

.card {
	margin: 0.42667rem 1.06667rem 0 1.06667rem;
	padding-bottom: 0.42667rem;
	box-shadow: none;
	border-radius: 0;
}

@media screen and (max-width: 750px) {
	.mobile-card {
		margin: 4px 10px 0 10px;
	}
}

.sub-card {
	border-left: 1px dashed rgb(59, 162, 244);
	border-bottom: 1px dashed rgb(59, 162, 244);
	box-shadow: none;
	border-radius: 0;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.dialog-footer button:first-child {
	margin-right: 10px;
}
</style>