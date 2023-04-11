<script lang="ts" setup>
import {login, getCaptcha} from "../api/loginRegister";
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

const emit = defineEmits(["toggle"])

const form = ref()
const openDialog = ref(props.open)
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

const emailRules = [
	{validate: (val: any) => !!val, message: "请输入邮箱"},
	{
		validate: (val: string) => {
			let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
			return reg.test(val);
		},
		message: "邮箱格式不正确",
	},
]
const passwordRules = [{validate: (val: any) => !!val, message: "请输入密码"}]
const captchaRules = [
	{validate: (val: any) => !!val, message: "请输入验证码"},
	{validate: (val: string) => val.toLowerCase() === captchaText.value, message: "验证码错误"},
]

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
			max-width="90%"
			v-model="openDialog"
		>
			<el-form ref="form" :model="validateForm.data" label-width="60">
				<el-form-item label="邮箱" prop="email" :rules="emailRules">
					<el-input placeholder="请输入邮箱" v-model.trim="validateForm.data.email" prop="email"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password" :rules="passwordRules">
					<el-input placeholder="请输入密码" v-model.trim="validateForm.data.password" type="password"
					          prop="password"></el-input>
				</el-form-item>
				<el-form-item label="验证码" prop="captcha" :rules="captchaRules">
					<el-input placeholder="请输入验证码" v-model.trim="validateForm.data.captcha" prop="captcha">
						<div @click="handleGetCaptcha" class="captcha" v-html="captcha"></div>
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
	
	/deep/ svg {
		vertical-align: middle;
	}
}
</style>