<template>
  <div>
    <mu-dialog
      scrollable
      title="注册"
      width="500"
      max-width="90%"
      :esc-press-close="false"
      :overlay-close="false"
      :open.sync="open"
    >
      <mu-form ref="form" :model="validateForm" label-width="100" label-position="right">
        <mu-form-item label="邮箱(必填)" prop="email" :rules="emailRules">
          <mu-text-field
            placeholder="请输入邮箱"
            v-model.trim="validateForm.email"
            prop="email"
          ></mu-text-field>
        </mu-form-item>

        <mu-form-item label="昵称(必填)" prop="nickName" :rules="nickNameRules">
          <mu-text-field
            placeholder="请输入昵称"
            v-model.trim="validateForm.nickName"
            prop="nickName"
          ></mu-text-field>
        </mu-form-item>

        <mu-form-item
          label="密码(必填)"
          prop="password"
          :rules="passwordRules"
        >
          <mu-text-field
            placeholder="请输入登录密码"
            v-model.trim="validateForm.password"
            prop="password"
            :action-icon="visibility ? 'visibility_off' : 'visibility'"
            :action-click="() => (visibility = !visibility)"
            :type="visibility ? 'text' : 'password'"
          ></mu-text-field>
        </mu-form-item>

        <mu-form-item
          label="确认密码"
          prop="confirmPassword"
          :rules="confirmPasswordRules"
        >
          <mu-text-field
            placeholder="请输入确认密码"
            type="password"
            v-model.trim="validateForm.confirmPassword"
            prop="confirmPassword"
          ></mu-text-field>
        </mu-form-item>

        <mu-form-item label="头像(必填)" prop="avatar" :rules="avatarRules">
          <mu-text-field
            placeholder="请输入头像地址"
            v-model.trim="validateForm.avatar"
            prop="avatar"
          ></mu-text-field>
        </mu-form-item>

        <mu-form-item
          label="个人简介"
          prop="introduction"
          :rules="introductionRules"
        >
          <mu-text-field
            placeholder="请输入个人简介"
            v-model="validateForm.introduction"
            prop="introduction"
            multi-line
            :rows="4"
            full-width
          ></mu-text-field>
        </mu-form-item>

        <mu-form-item label="验证码(必填)" prop="captcha" :rules="captchaRules">
          <mu-text-field
            placeholder="请输入验证码"
            v-model.trim="validateForm.captcha"
            prop="captcha"
          >
            <div @click="getCaptcha" class="captcha" v-html="captcha"></div>
          </mu-text-field>
        </mu-form-item>
      </mu-form>
      <mu-button slot="actions" flat small @click="clear">取消</mu-button>
      <mu-button slot="actions" flat small color="primary" @click="submit">注册</mu-button>
    </mu-dialog>
  </div>
</template>
<script>
// import {Icon} from "../utils";
import {register, getCaptcha} from "../api/loginRegister.ts";

export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    close() {
      this.open = false;
    },
    ok() {
      this.close();
    },
  },
  data() {
    return {
      // Icon,
      visibility: false,
      captcha: "",
      captchaText: "",
      emailRules: [
        {validate: (val) => !!val, message: "邮箱不能为空"},
        {
          validate: (val) => {
            let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            return reg.test(val);
          },
          message: "邮箱格式不正确",
        },
      ],
      nickNameRules: [
        {validate: (val) => !!val, message: "昵称不能为空"},
        {validate: (val) => val.length <= 20 && val.length >= 5, message: "昵称在5~20个字符之间"},
      ],
      passwordRules: [
        {validate: (val) => !!val, message: "密码不能为空"},
        {
          validate: (val) => {
            let reg = /^[a-zA-Z0-9_]{6,20}$/;
            return reg.test(val);
          },
          message: "长度在6~20之间，只能包含字母、数字和下划线",
        },
      ],
      confirmPasswordRules: [
        {validate: (val) => !!val, message: "请填写确认密码"},
        {
          validate: (val) => {
            return this.validateForm.password === val;
          },
          message: "密码不一致",
        },
      ],
      captchaRules: [
        {validate: (val) => !!val, message: "请输入验证码"},
        {validate: (val) => val.toLowerCase() === this.captchaText, message: "验证码错误"},
      ],
      avatarRules: [{validate: (val) => !!val, message: "请输入头像地址"}],
      introductionRules: [
        {
          validate: (val) => val.length <= 1000,
          message: "最大为1000个字符",
        },
      ],
      validateForm: {
        email: "",
        nickName: "",
        password: "",
        confirmPassword: "",
        avatar: "",
        introduction: "",
        captcha: "",
      },
    };
  },
  methods: {
    async getCaptcha() {
      const res = await getCaptcha()
      if (res.code === 200){
        this.captcha = res.data.data
        this.captchaText = res.data.text.toLowerCase()
      }
    },
    submit() {
      this.$refs.form.validate().then(async (result) => {
        if (result) {
          const res = await register(this.validateForm)
          if (res.code === 200) {
            this.$toast.success(res.msg);
            this.$emit("toggle", false);
            this.$emit("toLogin", true);
          } else {
            this.$toast.error(res.msg);
            await this.getCaptcha()
          }
        }else {
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
        avatar: "",
        introduction: "",
        captcha: "",
      };
      this.$emit("toggle", false);
    },
  },
  watch: {
    open(newVal) {
      if (newVal) {
        this.getCaptcha(); // 每次打开弹框就获取一下验证码
      }
    },
  },
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