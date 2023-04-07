<template>
  <div class="right-config">
    <mu-card class="slider-card">
      <mu-avatar class="avatar" size="100">
        <img :src="userInfo?userInfo.avatar:avatarBg" alt="头像">
      </mu-avatar>
      <div class="title">{{userInfo?userInfo.nickName:'欢迎~请先登录'}}</div>
      <div class="desc">{{userInfo?.email}}</div>
      <div class="desc">{{userInfo?.introduction}}</div>
      <div class="friend-link-box">
        <p class="friend-link-title">友情链接</p>
        <div class="friend-links">
          <a href="https://github.com" target="_blank">
            <mu-button fab small>
              <mu-avatar size="40">
                <img src="../assets/github.png">
              </mu-avatar>
            </mu-button>
          </a>
          <a href="https://segmentfault.com" target="_blank">
            <mu-button fab small>
              <mu-avatar size="40">
                <img src="../assets/sf.jpeg">
              </mu-avatar>
            </mu-button>
          </a>
          <a href="https://www.zhihu.com" target="_blank">
            <mu-button fab small>
              <mu-avatar size="40">
                <img src="../assets/zhihu.jpg">
              </mu-avatar>
            </mu-button>
          </a>
        </div>
      </div>
    </mu-card>
    <!--    广告-->
    <mu-card class="slider-card card-ad">
      <div class="ad">广告</div>
      <mu-carousel style="height: 120px;" hide-indicators hide-controls>
        <mu-carousel-item>
          <img style="width: 100%;cursor: pointer"
               src="https://img.alicdn.com/tfs/TB1v0eeB4z1gK0jSZSgXXavwpXa-2880-574.png">
        </mu-carousel-item>
        <mu-carousel-item>
          <img style="width: 100%;cursor: pointer"
               src="https://tpc.googlesyndication.com/daca_images/simgad/6732067775480687868">
        </mu-carousel-item>
      </mu-carousel>
    </mu-card>
    <mu-card class="slider-card">
      <div class="friend-link-box">
        <p class="friend-link-title">电影推荐</p>
        <div class="friend-links">
          <div class="tags">
            <mu-chip class="chip">流浪地球</mu-chip>
            <mu-chip class="chip">密室逃生</mu-chip>
            <mu-chip class="chip">寂静之地</mu-chip>
          </div>
        </div>
      </div>
      <div class="friend-link-box">
        <p class="friend-link-title">电视剧推荐</p>
        <div class="friend-links">
          <div class="tags">
            <mu-chip class="chip">狂飙</mu-chip>
            <mu-chip class="chip">三体</mu-chip>
            <mu-chip class="chip">沙海</mu-chip>
          </div>
        </div>
      </div>
      <div class="friend-link-box">
        <p class="friend-link-title">音乐推荐</p>
        <div style="margin-top: -6px;margin-bottom: 8px;color: #ccc;">（点击即可播放）</div>
        <div class="friend-links">
          <div class="tags">
            <mu-chip class="chip" @click="playMusic('ColdHearted')">红颜如霜</mu-chip>
            <mu-chip class="chip" @click="playMusic('PinkOcean')">粉色海洋</mu-chip>
            <mu-chip class="chip" @click="playMusic('GoodNight')">云烟成雨</mu-chip>
            <mu-chip class="chip" @click="playMusic('SummerWind')">夏天的风</mu-chip>
          </div>
        </div>
      </div>
    </mu-card>
    <div class="mp3player">
      <mu-slide-left-transition>
        <audio v-show="mp3playerShow" ref="mp3player" controls="controls" class="player"
               :src="music"
               preload="auto"></audio>
      </mu-slide-left-transition>
      <div v-show="mp3playerShow" class="closePlayer" @click="closePlayer">×</div>
    </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                userInfo: JSON.parse(localStorage.getItem('userInfo')),
                avatarBg: require('../assets/avatarBg.png'),
                mp3playerShow: false,
                music: '',
            }
        },
        methods: {
            playMusic(music) {
                this.music = require(`../assets/${music}.flac`)
                this.mp3playerShow = true
                this.$nextTick(() => {
                    this.$refs.mp3player.play()
                })
            },
            closePlayer() {
                this.mp3playerShow = false
                this.$refs.mp3player.pause()
            }
        }
    }
</script>

<style lang="less" scoped>
  .right-config {
    width: 4rem;
  }

  .slider-card {
    position: sticky;
    top: 80px;
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

  .card-ad {
    padding: 8px;
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
</style>