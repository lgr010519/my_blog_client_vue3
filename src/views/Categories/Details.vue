<template>
  <div class="common" :style="{background:`url(${categoryDetailBg}) center center no-repeat`,backgroundSize:'cover'}">
    <Header :light-index="3" background="transparent"></Header>
    <div class="PC-footer">
      <Footer fixed></Footer>
    </div>
    <div class="content mobile-content">
      <mu-paper class="pc-box" :z-depth="5">
        <mu-list>
          <div class="sub-title">
            分类 - {{categories}}（{{totalCount}}）
            <mu-button flat @click="$router.go(-1)" class="back-btn">
              <mu-icon value="arrow_forward"></mu-icon>
            </mu-button>
          </div>
          <mu-list-item button v-for="item in articles" :key="item._id" @click="goDetail(item)">
            <mu-list-item-title class="item">
              <span class="title">{{item.title}}</span>
              <span>{{item.createTime}}</span>
            </mu-list-item-title>
          </mu-list-item>
        </mu-list>
        <div class="pagination">
          <mu-pagination raised circle :total="totalCount" :current.sync="page"
                         :page-size.sync="pageSize" @change="pageChange"></mu-pagination>
        </div>
      </mu-paper>
    </div>
  </div>
</template>

<script>
    import Header from "../../components/Header.vue";
    import Footer from "../../components/Footer.vue";
    import moment from "moment"
    import {getArticlesByCategories} from "../../api/categories.ts";

    export default {
        name: "categoriesDetails",
        components: {
            Header,
            Footer,
        },
        data() {
            return {
                categoryDetailBg: require('../../assets/tags.jpeg'),
                page: 1,
                pageSize: 6,
                categories: '',
                otherCategories: '',
                articles: [],
                totalCount: 0,
            }
        },
        mounted() {
            this.categories = this.$route.query.categories
            this.otherCategories = this.$route.query?.otherCategories
            this.getArticlesByCategories()
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
            async getArticlesByCategories() {
                const res = await getArticlesByCategories({
                    categories: this.categories !== '其他' ? this.categories : this.otherCategories,
                    page: this.page,
                    pageSize: this.pageSize
                })
                if (res.code === 200) {
                    const handleRes = res.data.articles
                    handleRes.map(item => {
                        item.createTime = moment(item.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')
                    })
                    this.articles = handleRes
                    this.totalCount = res.data.totalCount
                }
            },
            pageChange(page) {
                this.page = page
                this.getArticlesByCategories()
            }
        }
    }
</script>

<style lang="less" scoped>
  @media screen and (min-width: 750px) {
    .PC-footer {
      display: block;
    }

    .mobile-footer,
    .mobile-backBtn {
      display: none;
    }

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
    }
  }

  @media screen and (max-width: 750px) {
    .PC-footer {
      display: none;
    }

    .mobile-footer,
    .mobile-backBtn {
      display: block;
    }

    // 移动端返回上一页
    .mobile-backBtn {
      position: fixed;
      left: 10px;
      top: 50%;
    }

    .mobile-content {
      position: absolute;
      top: 56px;
      bottom: 0;
      overflow: auto;
      width: 100%;
      padding-top: 20px;
    }
  }

  .sub-title {
    position: relative;

    .back-btn {
      position: absolute;
      top: -2px;
      right: -12px;
    }
  }
</style>