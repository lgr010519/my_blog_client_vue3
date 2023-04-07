<template>
  <div class="common" :style="{background:`url(${tagsBg}) center center no-repeat`,backgroundSize:'cover'}">
    <Header :light-index="4" background="transparent"></Header>
    <Footer fixed></Footer>
    <div class="content">
      <div class="tags-wap tagcloud">
        <router-link v-for="item in tags" :key="item.name" :to="{
          name:'tagsDetails',
          query:{
            id:item.name,
            count:item.articleNum,
          }}">
          <mu-chip class="tag" :color="item.color">{{item.name}}({{item.articleNum}})</mu-chip>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
    import Header from "../../components/Header.vue";
    import Footer from "../../components/Footer.vue";
    import {randomColor} from "../../utils";
    import {getTags} from "../../api/tags.ts";

    export default {
        name: "tags",
        components: {
            Header,
            Footer,
        },
        data() {
            return {
                tagsBg: require('../../assets/categoryBg.png'),
                tags: [],
            }
        },
        mounted() {
            this.getTags().then(() => {
                window.tagcloud({
                    selector: ".tagcloud", //元素选择器
                    fontsize: 16, //基本字体大小, 单位px
                    radius: 150, //滚动半径, 单位px
                    mspeed: "normal", //滚动最大速度, 取值: slow, normal(默认), fast
                    ispeed: "normal", //滚动初速度, 取值: slow, normal(默认), fast
                    direction: 135, //初始滚动方向, 取值角度(顺时针360): 0对应top, 90对应left, 135对应right-bottom(默认)...
                    keep: false, //鼠标移出组件后是否继续随鼠标滚动, 取值: false, true(默认) 对应 减速至初速度滚动, 随鼠标滚动
                })
            })
        },
        methods: {
            async getTags() {
                const res = await getTags({
                    page: 1,
                    pageSize: 9999
                })
                const handleTags = res.data.list
                handleTags.map(item => {
                    item.color = randomColor()
                })
                this.tags = handleTags
            }
        }
    }
</script>

<style lang="less" scoped>
  .content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 64px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;

    .tags-wap {
      padding: 0 0.53333rem;
      width: 100%;
      height: 100%;

      .tag {
        margin-right: 0.53333rem;
        margin-bottom: 0.53333rem;
        cursor: pointer;
      }
    }
  }
</style>
