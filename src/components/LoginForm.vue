<script lang="ts" setup>
import {login, getCaptcha} from "../api/loginRegister";
import {defineEmits, defineProps, reactive, ref, watch} from "vue";
import {ElMessage, FormInstance, FormRules} from "element-plus";

const props = defineProps({
	open: Boolean
})

const emit = defineEmits(["toggle"])

const form = ref()
const captcha = ref('')
const captchaText = ref('')
const validateForm = reactive({
	data: {
		email: "",
		nickName: "",
		password: "",
		confirmPassword: "",
		introduction: "",
		captcha: ""
	}
})

const rules = reactive<FormRules>({
	email: [
		{required: true, message: "请输入邮箱", trigger: 'blur'},
		{
			validator: (rule: any, value: any, callback: any) => {
				const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
				if (!reg.test(value)) {
					callback(new Error('邮箱格式不正确'))
				} else {
					callback()
				}
			},
			trigger: 'blur'
		},
	],
	password: [{required: true, message: "请输入密码", trigger: 'blur'}],
	captcha: [
		{required: true, message: "请输入验证码", trigger: 'blur'},
		{
			validator: (rule: any, value: any, callback: any) => {
				if (value.toLowerCase() !== captchaText.value) {
					callback(new Error('验证码错误'))
				} else {
					callback()
				}
			},
			trigger: 'blur'
		},
	],
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
	await form.validate(async (valid) => {
		if (valid) {
			const res: any = await login(validateForm.data)
			if (res.code === 200) {
				ElMessage({
					message: res.msg,
					type: 'success'
				})
				emit("toggle", false);
				localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
				localStorage.setItem('token', res.data.token)
				location.reload();
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
		introduction: "",
		captcha: ""
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
			title="登录"
			width="500"
			v-model="props.open"
			:close-on-click-modal="false"
			:show-close="false"
			center
		>
			<el-form ref="form" :model="validateForm.data" label-width="70" :rules="rules">
				<el-form-item label="邮箱" prop="email">
					<el-input placeholder="请输入邮箱" v-model.trim="validateForm.data.email" prop="email"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input placeholder="请输入密码" v-model.trim="validateForm.data.password" type="password"
					          prop="password" show-password></el-input>
				</el-form-item>
				<el-form-item label="验证码" prop="captcha">
					<el-input placeholder="请输入验证码" v-model.trim="validateForm.data.captcha" prop="captcha">
						<template #suffix>
							<div @click="handleGetCaptcha" class="captcha" v-html="captcha"></div>
						</template>
					</el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="clear(form)">取消</el-button>
					<el-button type="primary" @click="submit(form)">登录</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<style lang="less" scoped>
.captcha {
	cursor: pointer;
	margin-right: -10px;
	
	/deep/ svg {
		vertical-align: middle;
	}
}
</style>