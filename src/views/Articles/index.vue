<template>
  <div class="articles">
    <Header :light-index="1"></Header>
    <div class="content">
      <div class="right">
        <RightConfig></RightConfig>
      </div>
      <div class="wap-left left">
        <mu-card @click="goDetail(item)" class="card" v-for="item in info.list" :key="item._id">
          <div class="cover">
            <img class="cover-img" v-lazy="item.cover">
          </div>
          <div class="card-box">
            <div class="title">{{ item.title }}</div>
            <mu-card-actions class="sub-title">
              <mu-button class="cursor-default" flat color="rgb(154,205,50)">查看（{{ item.views }}）
              </mu-button>
              <mu-button class="cursor-default" flat color="rgb(33,150,243)" v-if="item.isLike">点赞（{{ item.like }}）
              </mu-button>
              <mu-button class="cursor-default" flat color="rgb(156,39,176)" v-if="item.isCollect">收藏（{{ item.collect }}）
              </mu-button>
              <mu-button class="cursor-default" flat color="rgb(244,67,54)" v-if="item.isComment">评论（{{ item.comment }}）
              </mu-button>
              <mu-button class="cursor-default" flat color="#9e9e9e">{{ item.createTime }}</mu-button>
            </mu-card-actions>
            <mu-card-text class="text">
              {{ item.introduction }}
            </mu-card-text>
            <mu-card-actions>
              <mu-button class="cursor-default chip" flat color="primary">
                <mu-icon left value="dns"></mu-icon>
                {{ item.categories }}
              </mu-button>
              <br/>
              <mu-button v-for="sub in item.tags" :key="sub" class="cursor-default chip" flat>
                <mu-icon left value="loyalty"></mu-icon>
                {{ sub }}
              </mu-button>
            </mu-card-actions>
          </div>
        </mu-card>
      </div>
    </div>
    <div v-if="info.totalCount > info.pageSize" class="pagination">
      <mu-pagination
        raised
        circle
        :total="info.totalCount"
        :current.sync="info.page"
        :pageSize.sync="info.pageSize"
        :pageCount="5"
        @change="pageChange"
      ></mu-pagination>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
    import Header from "../../components/Header.vue";
    import Footer from "../../components/Footer.vue";
    import RightConfig from "../../components/RightConfig.vue";
    import {getArticles} from "../../api/articles.ts";
    import moment from "moment"

    export default {
        name: "articles",
        components: {
            Header,
            Footer,
            RightConfig,
        },
        data() {
            return {
                info: {},
                page: 1,
                pageSize: 6,
            };
        },
        mounted() {
            this.getArticles()
        },
        methods: {
            goDetail(item) {
                this.$router.push({
                    name: 'articlesDetails',
                    query: {
                        id: item._id
                    }
                })
            },
            async getArticles() {
                const res = await getArticles({
                    page: this.page,
                    pageSize: this.pageSize,
                    status: 1, // 文章为启用状态
                    publishStatus: 1, // 文章为发布状态
                })
                if (res.code === 200) {
                    const handleRes = res.data
                    handleRes.list.map(item => {
                        item.createTime = moment(item.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')
                    })
                    this.info = handleRes
                }
            },
            pageChange(page) {
                this.page = page
                this.getArticles({
                    page: this.page,
                    pageSize: this.pageSize,
                    status: 1, // 文章为启用状态
                    publishStatus: 1, // 文章为发布状态
                }).then(() => {
                    document.body.scrollIntoView({
                        block: 'start',
                        behavior: 'smooth'
                    })
                })
            }
        }
    }
</script>

<style lang="less" scoped>
  .articles {
    padding-top: 64px;

    .content {
      padding-bottom: 0.53333rem;
      display: flex;

      .left {
        flex: 9;

        &.wap-left {
          .card {
            float: none;
            width: 90%;
          }
        }

        .card {
          width: 80%;
          float: left;
          margin: 0.42667rem auto 0;
          display: flex;
          flex-wrap: wrap;
          border-radius: 5px;
          cursor: pointer;

          &:hover {
            transform: scale(1.1);
            transition: all .6s;
          }

          .title {
            padding: 0.42667rem 0.42667rem 0 0.42667rem;
            font-size: 0.4rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            cursor: pointer;
          }

          .sub-title {
            display: flex;
            flex-wrap: wrap;
          }

          .text {
            padding: 0 0.42667rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
          }

          .chip {
            margin-right: 0.26667rem;
          }

          .cover {
            flex: 1;
            border-radius: 0;
            padding: 0.42667rem;

            .cover-img {
              object-fit: cover;
              width: 100%;
              height: 4.26667rem;
              vertical-align: middle;
            }
          }

          .card-box {
            flex: 2;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
          }
        }
      }

      .right {
        flex: 3;
        display: flex;
        justify-content: center;
      }
    }

    .box {
      justify-content: center !important;
      padding-bottom: 0.53333rem;
    }
  }

  .pagination {
    margin: 0.53333rem 0;
    display: flex;
    justify-content: center;
  }

  @media screen and (min-width: 750px) {
    .cover {
      display: block;
    }

    .right {
      display: flex;
    }
  }

  @media screen and (max-width: 750px) {
    .cover {
      display: none;
    }

    .right {
      display: none;
    }
  }

  /deep/ .mu-button-wrapper {
    text-transform: lowercase;
  }
</style>