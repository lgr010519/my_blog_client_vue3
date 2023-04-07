<template>
  <div>
    <mu-dialog :fullscreen="!isPC" width="60%" :open.sync="openModal">
      <slot name="title">
        <mu-auto-complete
          action-icon="search"
          label-float
          :data="keywords"
          label="文章搜索"
          :max-search-results="20"
          v-model="keyword"
          open-on-focus
          avatar
          full-width
          @input="handleSearch"
          :action-click="handleSearch"
          autofocus
        >
          <template slot-scope="scope">
            <mu-list-item-action>
              <mu-avatar color="primary">{{scope.item.substring(0, 1)}}</mu-avatar>
            </mu-list-item-action>
            <mu-list-item-content v-html="scope.highlight"></mu-list-item-content>
          </template>
        </mu-auto-complete>
      </slot>
      <div v-if="list && list.length === 0" class="no-content">暂无内容</div>

      <mu-list v-else class="list" textline="two-line">
        <mu-list-item :key="item._id" v-for="item in list" button @click="goDetail(item)">
          <mu-list-item-action>
            <mu-avatar>
              <img :src="item.cover"/>
            </mu-avatar>
          </mu-list-item-action>
          <mu-list-item-content style="width: 693px;">
            <mu-list-item-title v-html="item.title"></mu-list-item-title>
            <mu-list-item-sub-title>
              <span>{{item.introduction}}</span>
            </mu-list-item-sub-title>
          </mu-list-item-content>
          <mu-list-item-action style="width: 92px;text-align: center;">{{item.createTime}}</mu-list-item-action>
        </mu-list-item>
      </mu-list>

      <mu-button v-if="!isPC" class="close" icon @click="clear(false)">
        <mu-icon value="close"></mu-icon>
      </mu-button>
    </mu-dialog>
  </div>
</template>
<script>
    import {getArticles} from "../api/articles.js";
    import moment from "moment"

    export default {
        props: ["open"],
        computed: {
            openModal: {
                get() {
                    return this.open;
                },
                set(val) {
                    this.clear(val);
                }
            }
        },
        data() {
            return {
                keywords: [],
                keyword: "",
                list: [],
                fullscreen: false,
                timer: null,
            };
        },
        mounted() {

        },
        methods: {
            clear(val) {
                this.keyword = "";
                this.$emit("toggle", val);
                this.list = [];
            },
            handleSearch() {
                if (this.timer) clearTimeout(this.timer) // 防抖
                this.timer = setTimeout(async () => {
                    const res = await getArticles({
                        title: this.keyword.trim(),
                        page: 1,
                        pageSize: 9999,
                        status: 1,
                        publishStatus: 1,
                    })
                    if (res.code === 200) {
                        const handleRes = res.data.list
                        handleRes.map(item => {
                            item.createTime = moment(item.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')
                            const lowerCaseTitle = item.title.toLowerCase()
                            const index = lowerCaseTitle.indexOf(this.keyword.toLowerCase())
                            const sliceStr = item.title.slice(index, index + this.keyword.length)
                            item.title = item.title.replace(sliceStr, `<strong style="color: rgb(33,150,243);">${sliceStr}</strong>`)
                        })
                        this.list = handleRes
                    }
                }, 500)
            },
            goDetail(item) {
                this.clear();
                this.$router.push({
                    name: "articlesDetails",
                    query: {id: item._id}
                });
            }
        },
        watch: {
            openModal(newVal) {
                if (newVal) {
                    this.handleSearch()
                }
            }
        }
    };
</script>
<style lang="less" scoped>
  .list {
    overflow-y: auto;
    max-height: 450px;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0.2);

      &:hover {
        background: rgba(0, 0, 0, 0.3);
      }
    }

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0);
      border-radius: 10px;
      background: rgba(0, 0, 0, 0);
    }
  }

  .no-content {
    text-align: center;
  }

  @media screen and (max-width: 750px) {
    .close {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  @media screen and (min-width: 750px) {
    .close {
      display: none;
    }
  }
</style>