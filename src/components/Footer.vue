<script lang="ts" setup>
import {defineProps} from "vue";

const props = defineProps({
	fixed: Boolean
})
</script>
<template>
	<div class="footer" :class="{'fixed-footer':props.fixed}">
		<div class="copyright">
			<a target="_blank" href="https://beian.miit.gov.cn">Copyright © 2023 LIUGAORONG・湘ICP备2023010519号</a>
			<div>本系统由 Vue + Muse-UI 提供技术支持</div>
		</div>
	</div>
</template>
<style lang="less" scoped>
.footer {
	text-align: center;
	font-size: 0.3rem;
	margin: 30px 0;
	
	.copyright {
		a {
			color: inherit;
		}
	}
}

.fixed-footer {
	position: fixed;
	bottom: 0;
	width: 100%;
	z-index: 1;
}
</style>