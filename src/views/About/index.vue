<template>
  <div class="common">
    <Header :light-index="5" background="transparent"></Header>
    <Footer fixed></Footer>

    <mu-carousel
      hide-indicators
      hide-controls
      style="position: fixed; height: 100%; margin-top: 0"
    >
      <mu-carousel-item v-for="item in imgs" :key="item">
        <img :src="item"/>
      </mu-carousel-item>
    </mu-carousel>

    <div class="content">
      <mu-card class="card">
        <mu-card-header class="card-header">
          <mu-paper class="avatar-box" circle :z-depth="5">
            <img class="avatar" src="../../assets/bloggerAvatar.jpg"/>
          </mu-paper>
        </mu-card-header>

        <mu-card-text>
          <div v-html="info.desc"></div>
        </mu-card-text>
        <div class="tags">
          <mu-chip
            class="tag"
            v-for="(item, index) in info.tags"
            :key="item.name"
            :color="item.color"
            @delete="remove(index)"
            delete
          >{{ item.name }}
          </mu-chip
          >
          <mu-button
            color="primary"
            v-if="info.tags && info.tags.length === 0"
            @click="reset"
          >reset
          </mu-button
          >
        </div>
      </mu-card>
    </div>
  </div>
</template>
<script>
    import {randomColor} from "../../utils";
    import Header from "../../components/Header.vue";
    import Footer from "../../components/Footer.vue";
    import {getAboutInfo} from "../../api/about.ts";

    export default {
        name: "about",
        components: {
            Header,
            Footer,
        },
        data() {
            return {
                info: {},
                imgs: [
                    require('../../assets/aboutBg1.jpg'),
                    require('../../assets/aboutBg2.jpg'),
                    require('../../assets/aboutBg3.jpg'),
                ]
            };
        },
        mounted() {
            this.getAboutInfo()
        },

        methods: {
            remove(index) {
                this.info.tags.splice(index, 1);
            },
            reset() {
                this.info.tags = [
                    {
                        name: "Vue",
                        color: randomColor(),
                    },
                    {
                        name: "React",
                        color: randomColor(),
                    },
                    {
                        name: "Node.js",
                        color: randomColor(),
                    },
                ];
            },
            async getAboutInfo() {
                const res = await getAboutInfo()
                if (res.code === 200) {
                    const handleRes = res.data
                    handleRes.tags = handleRes.tags.map(item => ({
                        name: item,
                        color: randomColor(),
                    }))
                    this.info = handleRes
                }
            }
        },
    };
</script>
<style lang="less" scoped>
  .content {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    /deep/ .mu-card-header {
      display: flex;
      justify-content: flex-end;
      height: 1.33333rem;
    }

    .avatar-box {
      width: 2.66667rem;
      height: 2.66667rem;
      position: absolute;
      top: -1.33333rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1;

      .avatar {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }

  .tags {
    padding: 0.42667rem;
    text-align: center;

    .tag {
      margin-bottom: 0.42667rem;
      margin-right: 0.42667rem;
    }
  }

  .mu-carousel {
    height: 5.33333rem;
    margin-top: 0.53333rem;
  }

  .mu-carousel-item > img {
    height: 100%;
  }

  .card {
    max-width: 15rem;
    width: 15rem;
    margin: 0 auto;
    background-color: rgba(255, 255, 255, .4);
    transition: all .8s;

    &:hover {
      background-color: rgba(255, 255, 255, 1);
    }
  }

  @media screen and (min-width: 750px) {
    .content {
      padding-top: 64px;

      .card {
        margin-top: 100px;

        .card-header {
          display: block;
        }
      }
    }
  }

  @media screen and (max-width: 750px) {
    .content {
      padding-top: 56px;

      .card {
        margin-top: 0;

        .card-header {
          display: none;
        }
      }
    }
  }
</style>