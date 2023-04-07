<script lang="ts" setup>
import {defineProps, ref, watch, defineEmits, onMounted} from 'vue'
import {ElMessage} from 'element-plus'

const props = defineProps({
	commentSuccess: Boolean,
	focusComment: () => {
	}
})
const content = ref('')
const commentTextField = ref(null)
const emit = defineEmits(["comment"])

const submit = () => {
	if (content) {
		emit("comment", {
			content,
		});
	} else {
		ElMessage("请输入评论内容哦");
	}
}

onMounted(() => {
	console.log('commentTextField.value', commentTextField.value)
})

// 评论成功后关闭弹框
watch(() => props.commentSuccess, (newVal) => {
	if (newVal) {
		// openAlert = !newVal;
		content.value = ''
	}
})
</script>
<template>
	<div class="clearfix">
		<el-input
			type="textarea"
			ref="commentTextField"
			class="comment-input"
			placeholder="说点什么..."
			:rows="4"
			v-model="content"
		></el-input>
		<el-button @click="submit" class="comment-btn" type="primary">评论</el-button>
	</div>
</template>
<style lang="less" scoped>
.comment-input {
	padding: 0 0.42667rem;
}

.comment-btn {
	margin: 0 0.42667rem 0.42667rem 0;
	float: right;
}
</style>