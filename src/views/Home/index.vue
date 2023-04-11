<script lang="ts" setup>
import IndexAnimation from "../../components/IndexAnimation.vue";
import Header from "../../components/Header.vue";
import {getHomeInfo} from "../../api/config";
import {onMounted, reactive} from "vue";

let i = 0;
let timer: string | number | NodeJS.Timeout | undefined;
const info = reactive({
	data:{
		welcome: "",
		welcomeText: "",
	}
})

onMounted(()=>{
	handleGetHomeInfo().then(() => {
		typing();
	})
})

// 打字机效果
const typing = () => {
	if (i <= info.data.welcomeText.length) {
		info.data.welcome = info.data.welcomeText.slice(0, i++) + "_";
		timer = setTimeout(typing, 100);
	} else {
		info.data.welcome = info.data.welcomeText; //结束打字,移除 _ 光标
		clearTimeout(timer);
	}
}

const handleGetHomeInfo=async () => {
	const res:any = await getHomeInfo()
	if (res.code === 200) {
		info.data.welcomeText = res.data.introduction
	}
}
</script>

<template>
  <div>
    <IndexAnimation></IndexAnimation>
    <Header background="transparent"></Header>
    <div class="common">
      <div class="home">
        {{ info.welcome }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  .home {
    position: absolute;
    top: 50%;
    width: 100%;
    text-align: center;
    transform: translateY(-50%);
    font-size: 0.48rem;
    color: #fff;
    font-weight: 500;
  }
</style>