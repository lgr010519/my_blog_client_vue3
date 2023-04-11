<script lang="ts" setup>
import {register, getCaptcha} from "../api/loginRegister";
import {defineEmits, defineProps, reactive, ref, watch} from "vue";
import {ElMessage, FormInstance} from "element-plus";

const props = defineProps({
	open: {
		type: Boolean,
		default: false
	},
	close: {
		type: Function,
		default: () => {
		},
	},
	ok: {
		type: Function,
		default: () => {
		}
	}
})

const emit = defineEmits(["toggle", "toLogin"])

const form = ref()
const openDialog = ref(props.open)
const visibility = ref(false)
const captcha = ref('')
const captchaText = ref('')
const emailRules = [
	{validate: (val: any) => !!val, message: "邮箱不能为空"},
	{
		validate: (val: string) => {
			let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
			return reg.test(val);
		},
		message: "邮箱格式不正确",
	},
]
const nickNameRules = [
	{validate: (val: any) => !!val, message: "昵称不能为空"},
	{validate: (val: string | any[]) => val.length <= 20 && val.length >= 5, message: "昵称在5~20个字符之间"},
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
const captchaRules = [
	{validate: (val: any) => !!val, message: "请输入验证码"},
	{validate: (val: string) => val.toLowerCase() === captchaText.value, message: "验证码错误"},
]
const avatarRules = [{validate: (val: any) => !!val, message: "请输入头像地址"}]
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
		password: "",
		confirmPassword: "",
		avatar: "",
		introduction: "",
		captcha: "",
	}
})

const handleGetCaptcha = async () => {
	const res: any = await getCaptcha()
	if (res.code === 200) {
		captcha.value = res.data.data
		captchaText.value = res.data.text.toLowerCase()
	}
}

const submit = async (form: FormInstance | undefined) => {
	if (!form) return;
	await form.validate(async (valid, fields) => {
		if (valid) {
			const res: any = await register(validateForm.data)
			if (res.code === 200) {
				ElMessage({
					message: res.msg,
					type: 'success'
				})
				emit("toggle", false);
				emit("toLogin", true);
			} else {
				ElMessage({
					message: res.msg,
					type: 'error'
				})
				await handleGetCaptcha()
			}
		} else {
			await handleGetCaptcha()
		}
	})
}

const clear = (form: FormInstance | undefined) => {
	if (!form) return;
	form.resetFields();
	validateForm.data = {
		email: "",
		nickName: "",
		password: "",
		confirmPassword: "",
		avatar: "",
		introduction: "",
		captcha: "",
	};
	emit("toggle", false);
}

watch(() => props.open, (newVal) => {
	if (newVal) {
		handleGetCaptcha()
	}
})
</script>

<template>
	<div>
		<el-dialog
			title="注册"
			width="500"
			max-width="90%"
			v-model="openDialog"
		>
			<el-form ref="form" :model="validateForm.data" label-width="100">
				<el-form-item label="邮箱(必填)" prop="email" :rules="emailRules">
					<el-input
						placeholder="请输入邮箱"
						v-model.trim="validateForm.data.email"
						prop="email"
					></el-input>
				</el-form-item>
				<el-form-item label="昵称(必填)" prop="nickName" :rules="nickNameRules">
					<el-input
						placeholder="请输入昵称"
						v-model.trim="validateForm.data.nickName"
						prop="nickName"
					></el-input>
				</el-form-item>
				<el-form-item
					label="密码(必填)"
					prop="password"
					:rules="passwordRules"
				>
					<el-input
						placeholder="请输入登录密码"
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
						placeholder="请输入确认密码"
						type="password"
						v-model.trim="validateForm.data.confirmPassword"
						prop="confirmPassword"
					></el-input>
				</el-form-item>
				<el-form-item label="头像(必填)" prop="avatar" :rules="avatarRules">
					<el-input
						placeholder="请输入头像地址"
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
						placeholder="请输入个人简介"
						v-model="validateForm.data.introduction"
						prop="introduction"
						:rows="4"
					></el-input>
				</el-form-item>
				<el-form-item label="验证码(必填)" prop="captcha" :rules="captchaRules">
					<el-input
						placeholder="请输入验证码"
						v-model.trim="validateForm.data.captcha"
						prop="captcha"
					>
						<div @click="handleGetCaptcha" class="captcha" v-html="captcha"></div>
					</el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="clear(form)">取消</el-button>
					<el-button type="primary" @click="submit(form)">注册</el-button>
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