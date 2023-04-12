<script lang="ts" setup>
import {nextTick, ref} from "vue";
import avatarBg from '../assets/avatarBg.png'
import github from '../assets/github.png'
import sf from '../assets/sf.jpeg'
import zhihu from '../assets/zhihu.jpg'

const userInfo = JSON.parse(localStorage.getItem('userInfo'))
const mp3playerShow = ref(false)
const musicSrc = ref('')
const mp3player = ref()

const playMusic = (music: any, mp3player: any) => {
	musicSrc.value = require(`../assets/${music}.flac`)
	mp3playerShow.value = true
	nextTick(() => {
		mp3player.play()
	})
}

const closePlayer = (mp3player: any) => {
	mp3playerShow.value = false
	mp3player.pause()
}
</script>

<template>
	<div class="right-config">
		<el-card class="slider-card">
			<el-avatar class="avatar" :size="100" :src="userInfo?userInfo.avatar:avatarBg"/>
			<div class="title">{{ userInfo ? userInfo.nickName : '欢迎~请先登录' }}</div>
			<div class="desc">{{ userInfo?.email }}</div>
			<div class="desc">{{ userInfo?.introduction }}</div>
			<div class="friend-link-box">
				<p class="friend-link-title">友情链接</p>
				<div class="friend-links">
					<a href="https://github.com" target="_blank">
						<el-button class="friend-link-button">
							<el-avatar size="40" :src="github"/>
						</el-button>
					</a>
					<a href="https://segmentfault.com" target="_blank">
						<el-button class="friend-link-button">
							<el-avatar size="40" :src="sf"/>
						</el-button>
					</a>
					<a href="https://www.zhihu.com" target="_blank">
						<el-button class="friend-link-button">
							<el-avatar size="40" :src="zhihu"/>
						</el-button>
					</a>
				</div>
			</div>
		</el-card>
		<!--    广告-->
		<el-card class="slider-card card-ad">
			<div class="ad">广告</div>
			<el-carousel height="120px" arrow="never">
				<el-carousel-item>
					<img style="width: 100%;cursor: pointer"
					     src="https://img.alicdn.com/tfs/TB1v0eeB4z1gK0jSZSgXXavwpXa-2880-574.png" alt="">
				</el-carousel-item>
				<el-carousel-item>
					<img style="width: 100%;cursor: pointer"
					     src="https://tpc.googlesyndication.com/daca_images/simgad/6732067775480687868" alt="">
				</el-carousel-item>
			</el-carousel>
		</el-card>
		<el-card class="slider-card">
			<div class="friend-link-box">
				<p class="friend-link-title">电影推荐</p>
				<div class="friend-links">
					<div class="tags">
						<el-tag class="chip">流浪地球</el-tag>
						<el-tag class="chip">密室逃生</el-tag>
						<el-tag class="chip">寂静之地</el-tag>
					</div>
				</div>
			</div>
			<div class="friend-link-box">
				<p class="friend-link-title">电视剧推荐</p>
				<div class="friend-links">
					<div class="tags">
						<el-tag class="chip">狂飙</el-tag>
						<el-tag class="chip">三体</el-tag>
						<el-tag class="chip">沙海</el-tag>
					</div>
				</div>
			</div>
			<div class="friend-link-box">
				<p class="friend-link-title">音乐推荐</p>
				<div style="margin-top: -6px;margin-bottom: 8px;color: #ccc;font-size: 12px;">（点击即可播放）</div>
				<div class="friend-links">
					<div class="tags">
						<el-tag class="chip" @click="playMusic('ColdHearted',mp3player)">红颜如霜</el-tag>
						<el-tag class="chip" @click="playMusic('PinkOcean',mp3player)">粉色海洋</el-tag>
						<el-tag class="chip" @click="playMusic('GoodNight',mp3player)">云烟成雨</el-tag>
						<el-tag class="chip" @click="playMusic('SummerWind',mp3player)">夏天的风</el-tag>
					</div>
				</div>
			</div>
		</el-card>
		<div class="mp3player">
			<transition>
				<audio v-show="mp3playerShow" ref="mp3player" controls="controls" class="player"
				       :src="musicSrc"
				       preload="auto"></audio>
			</transition>
			<div v-show="mp3playerShow" class="closePlayer" @click="closePlayer(mp3player)">×</div>
		</div>
	</div>
</template>

<style lang="less" scoped>
.slider-card {
	position: sticky;
	top: 80px;
	width: 184px;
	margin-top: 16px;
	text-align: center;
	padding: 16px;
	border-radius: 5px;
	box-shadow: 0 3px 3px -2px rgba(0, 0, 0, 0.2), 0 3px 4px 0 rgba(0, 0, 0, 0.14),
	0 1px 8px 0 rgba(0, 0, 0, 0.12);
	
	.avatar {
		box-shadow: 0 3px 3px -2px rgba(0, 0, 0, 0.2),
		0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 1px 8px 0 rgba(0, 0, 0, 0.12);
	}
	
	.title {
		font-size: 20px;
		color: #2196f3;
	}
	
	.desc {
		font-size: 14px;
		margin: 10px 0;
	}
	
	.tags {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		
		.chip {
			margin: 4px;
		}
	}
	
	.friend-link-box {
		.friend-link-title {
			position: relative;
			font-size: 12px;
			
			&::before {
				content: "";
				width: 30%;
				height: 1px;
				background: #ccc;
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
			}
			
			&::after {
				content: "";
				width: 30%;
				height: 1px;
				background: #ccc;
				position: absolute;
				right: 0;
				top: 50%;
				transform: translateY(-50%);
			}
		}
		
		.friend-links {
			display: flex;
			justify-content: space-around;
			
			.friend-link-button {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				
				&:hover {
					box-shadow: 0 3px 5px -1px rgb(0 0 0 / 20%), 0 6px 10px 0 rgb(0 0 0 / 14%), 0 1px 18px 0 rgb(0 0 0 / 12%);
				}
			}
		}
	}
	
	.ad {
		position: absolute;
		z-index: 1;
		right: 8px;
		top: 8px;
		font-size: 12px;
	}
}

.mp3player {
	position: fixed;
	left: 72px;
	top: 5px;
	z-index: 9999;
	
	.player {
	
	}
	
	.closePlayer {
		position: absolute;
		left: 290px;
		top: 12px;
		width: 30px;
		height: 30px;
		line-height: 31px;
		text-align: center;
		font-size: 20px;
		cursor: pointer;
		border-radius: 50%;
		
		&:hover {
			background-color: rgba(0, 0, 0, 0.05);
		}
	}
}

:deep(.el-card__body) {
	padding: 0;
}
</style>