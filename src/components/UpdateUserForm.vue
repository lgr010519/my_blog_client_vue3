<script lang="ts" setup>
import {updateUserInfo} from "../api/user";
import {defineEmits, defineProps, reactive, ref, watch} from "vue";
import {ElMessage, FormInstance} from "element-plus";
// import {Icon} from "../utils";

const props = defineProps({
	open: Boolean,
	userInfo: Object
})

const emit = defineEmits(['toggle'])

const form = ref()
const nickNameRules = [
	{validate: (val: string | any[]) => val.length <= 20, message: "昵称不能超过20个字符"},
]
const passwordRules = [
	{validate: (val: any) => !!val, message: "密码不能为空"},
	{
		validate: (val: string) => {
			let reg = /^[a-zA-Z0-9_]{6,20}$/;
			return reg.test(val);
		},
		message: "长度在6~20之间，只能包含字母、数字和下划线",
	},
]
const confirmPasswordRules = [
	{validate: (val: any) => !!val, message: "请填写确认密码"},
	{
		validate: (val: any) => {
			return validateForm.data.password === val;
		},
		message: "密码不一致",
	},
]
const introductionRules = [
	{
		validate: (val: string | any[]) => val.length <= 1000,
		message: "最大为1000个字符",
	},
]
const validateForm = reactive({
	data: {
		email: "",
		nickName: "",
		oldPassword: "",
		password: "",
		confirmPassword: "",
		avatar: "",
		introduction: "",
	}
})

const submit = async (form: FormInstance | undefined) => {
	if (!form) return;
	await form.validate(async (valid) => {
		if (valid) {
			const res: any = await updateUserInfo(validateForm.data)
			if (res.code === 200) {
				ElMessage({
					message: res.msg,
					type: 'success'
				})
				emit("toggle", false);
				location.reload()
			} else {
				ElMessage({
					message: res.msg,
					type: 'error'
				})
			}
		}
	})
}

const clear = (form: FormInstance | undefined) => {
	if (!form) return;
	form.resetFields();
	validateForm.data = {
		...validateForm.data,
		...props.userInfo,
		oldPassword: "",
		password: "",
		confirmPassword: "",
	};
	emit("toggle", false);
}

watch(() => props.userInfo, (newVal) => {
	if (newVal) {
		validateForm.data = {
			...validateForm.data,
			...props.userInfo,
			oldPassword: "",
			password: "",
			confirmPassword: "",
		}
	}
})
</script>

<template>
	<div>
		<el-dialog
			title="修改资料"
			width="500"
			max-width="90%"
			v-model="open"
		>
			<el-form ref="form" :model="validateForm.data" label-position="top">
				<el-form-item label="邮箱(用于登录，不可修改)" prop="email">
					<el-input
						disabled
						v-model.trim="validateForm.data.email"
						prop="email"
					></el-input>
				</el-form-item>
				<el-form-item label="昵称" prop="nickName" :rules="nickNameRules">
					<el-input
						v-model.trim="validateForm.data.nickName"
						prop="nickName"
					></el-input>
				</el-form-item>
				<el-form-item
					label="原密码"
					prop="oldPassword"
					:rules="passwordRules"
				>
					<el-input
						v-model.trim="validateForm.data.oldPassword"
						prop="password"
						show-password
					></el-input>
				</el-form-item>
				<el-form-item
					label="新密码"
					prop="password"
					:rules="passwordRules"
				>
					<el-input
						v-model.trim="validateForm.data.password"
						prop="password"
						show-password
					></el-input>
				</el-form-item>
				<el-form-item
					label="确认密码"
					prop="confirmPassword"
					:rules="confirmPasswordRules"
				>
					<el-input
						type="password"
						v-model.trim="validateForm.data.confirmPassword"
						prop="confirmPassword"
					></el-input>
				</el-form-item>
				<el-form-item label="头像" prop="avatar">
					<el-input
						v-model.trim="validateForm.data.avatar"
						prop="avatar"
					></el-input>
				</el-form-item>
				<el-form-item
					label="个人简介"
					prop="introduction"
					:rules="introductionRules"
				>
					<el-input
						type="textarea"
						v-model="validateForm.data.introduction"
						prop="introduction"
						:rows="4"
					></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="clear(form)">取消</el-button>
					<el-button type="primary" @click="submit(form)">修改</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<style lang="less" scoped>
.captcha {
	cursor: pointer;
	
	/deep/ svg {
		vertical-align: middle;
	}
}
</style>