<script setup>
import {index_fullScreenAnimation} from '../utils'
import {onMounted, ref} from "vue";

const canvas = ref()

onMounted(() => {
	// index_fullScreenAnimation(canvas.value)
})
</script>

<template>
	<canvas class="index-canvas" ref="canvas"></canvas>
</template>

<style scoped lang="less">
.index-canvas {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
}
</style>
