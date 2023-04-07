<template>
  <div>
    <mu-dialog
      title="登录"
      width="500"
      max-width="90%"
      :esc-press-close="false"
      :overlay-close="false"
      :open.sync="open"
    >
      <mu-form ref="form" :model="validateForm" label-width="60" label-position="right">
        <mu-form-item label="邮箱" prop="email" :rules="emailRules">
          <mu-text-field placeholder="请输入邮箱" v-model.trim="validateForm.email" prop="email"></mu-text-field>
        </mu-form-item>

        <mu-form-item label="密码" prop="password" :rules="passwordRules">
          <mu-text-field placeholder="请输入密码" v-model.trim="validateForm.password" type="password" prop="password"></mu-text-field>
        </mu-form-item>

        <mu-form-item label="验证码" prop="captcha" :rules="captchaRules">
          <mu-text-field placeholder="请输入验证码" v-model.trim="validateForm.captcha" prop="captcha">
            <div @click="getCaptcha" class="captcha" v-html="captcha"></div>
          </mu-text-field>
        </mu-form-item>
      </mu-form>

      <mu-button slot="actions" flat small @click="clear">取消</mu-button>
      <mu-button slot="actions" flat small color="primary" @click="submit">登录</mu-button>
    </mu-dialog>
  </div>
</template>
<script>
    // import {Icon} from "../utils/index.js";
    import {login, getCaptcha} from "../api/loginRegister.ts";

    export default {
        props: {
            open: {
                type: Boolean,
                default: false
            },
            close() {
                this.open = false;
            },
            ok() {
                this.close();
            }
        },
        data() {
            return {
                captcha: "",
                captchaText: "",
                emailRules: [
                    {validate: val => !!val, message: "请输入邮箱"},
                    {
                        validate: (val) => {
                            let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
                            return reg.test(val);
                        },
                        message: "邮箱格式不正确",
                    },
                ],
                passwordRules: [{validate: val => !!val, message: "请输入密码"}],
                captchaRules: [
                    {validate: val => !!val, message: "请输入验证码"},
                    {validate: val => val.toLowerCase() === this.captchaText, message: "验证码错误"},
                ],
                validateForm: {
                    email: "",
                    password: "",
                    captcha: "",
                },
                // Icon
            };
        },
        methods: {
            async getCaptcha() {
                const res = await getCaptcha()
                if (res.code === 200) {
                    this.captcha = res.data.data
                    this.captchaText = res.data.text.toLowerCase()
                }
            },
            submit() {
                this.$refs.form.validate().then(async result => {
                    if (result) {
                        const res = await login(this.validateForm)
                        if (res.code === 200) {
                            this.$toast.success(res.msg);
                            this.$emit("toggle", false);
                            localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
                            localStorage.setItem('token', res.data.token)
                            location.reload();
                        } else {
                            this.$toast.error(res.msg);
                            await this.getCaptcha()
                        }
                    } else {
                        await this.getCaptcha()
                    }
                });
            },
            clear() {
                this.$refs.form.clear();
                this.validateForm = {
                    email: "",
                    nickName: "",
                    password: "",
                    confirmPassword: "",
                    introduction: "",
                    captcha: ""
                };
                this.$emit("toggle", false);
            }
        },
        watch: {
            open(newVal) {
                if (newVal) {
                    this.getCaptcha(); // 每次打开弹框就获取一下验证码
                }
            }
        }
    };
</script>
<style lang="less" scoped>
  .captcha {
    cursor: pointer;

    /deep/ svg {
      vertical-align: middle;
    }
  }
</style>