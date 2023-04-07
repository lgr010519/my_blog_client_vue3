<template>
  <div class="details">
    <Header :light-index="1"></Header>
    <div class="content">
      <div class="right">
        <RightConfig></RightConfig>
      </div>
      <div class="left">
        <div class="left-box">
          <mu-card class="card">
            <mu-card-title :title="info.title" :sub-title="info.introduction" style="overflow: hidden"></mu-card-title>
            <mu-button @click="$router.go(-1)" class="back-top" flat>
              <mu-icon value="arrow_forward"></mu-icon>
            </mu-button>
            <mu-card-media>
              <img :src="info.cover" style="height: 100%;" alt="cover">
            </mu-card-media>
            <mu-card-actions class="sub-title">
              <span class="cursor-default" style="color: #fdd835">字数（{{ info.content?.length }}）</span>
              <span class="cursor-default"
                    style="color: #ff4081">阅读大约{{ (info.content?.length / 500).toFixed(0) }}分钟</span>
              <span class="cursor-default" style="color: rgb(154,205,50)">查看（{{ info.views }}）</span>
              <span class="cursor-default" style="color: rgb(33,150,243)" v-if="info.isLike">点赞（{{ info.like }}）</span>
              <span class="cursor-default" style="color: rgb(156,39,176)"
                    v-if="info.isCollect">收藏（{{ info.collect }}）</span>
              <span class="cursor-default" style="color: rgb(244,67,54)"
                    v-if="info.isComment">评论（{{ info.comment }}）</span>
              <span class="cursor-default" style="color: #9e9e9e">{{ info.createTime }}</span>
            </mu-card-actions>
            <mavon-editor
                v-model="info.content"
                defaultOpen="preview"
                :toolbarsFlag="false"
                :subfield="false"
                :navigation="true"
                codeStyle="tomorrow-night-eighties"/>
            <mu-card-actions>
              <mu-button class="cursor-default chip" flat color="primary">
                <mu-icon left value="dns"></mu-icon>
                {{ info.categories }}
              </mu-button>
              <mu-button v-for="sub in info.tags" :key="sub" class="cursor-default chip" flat>
                <mu-icon left value="loyalty"></mu-icon>
                {{ sub }}
              </mu-button>
            </mu-card-actions>
          </mu-card>
          <div class="right-action-list">
            <mu-tooltip v-if="info.isLike" placement="top" content="点赞">
              <mu-button fab color="primary" @click="like" class="operationBtn" v-if="info.isLike">
                <div class="operationBtnContent">{{ info.like || 0 }}</div>
                <mu-icon value="thumb_up"></mu-icon>
              </mu-button>
            </mu-tooltip>
            <mu-tooltip v-if="info.isCollect" placement="top" content="收藏">
              <mu-button fab color="purple500" @click="collect" class="operationBtn" v-if="info.isCollect">
                <div class="operationBtnContent">{{ info.collect || 0 }}</div>
                <mu-icon value="grade"></mu-icon>
              </mu-button>
            </mu-tooltip>
            <mu-tooltip v-if="info.isComment" placement="top" content="评论">
              <mu-button fab color="red" @click="toComment" class="operationBtn" v-if="info.isComment">
                <div class="operationBtnContent">{{ info.comment || 0 }}</div>
                <mu-icon value="chat"></mu-icon>
              </mu-button>
            </mu-tooltip>
          </div>
          <div class="action-list" ref="comment">
            <mu-tooltip v-if="info.isLike" placement="top" content="点赞">
              <mu-button fab color="primary" @click="like" class="operationBtn" v-if="info.isLike">
                <div class="operationBtnContent">{{ info.like || 0 }}</div>
                <mu-icon value="thumb_up"></mu-icon>
              </mu-button>
            </mu-tooltip>
            <mu-tooltip v-if="info.isCollect" placement="top" content="收藏">
              <mu-button fab color="purple500" @click="collect" class="operationBtn" v-if="info.isCollect">
                <div class="operationBtnContent">{{ info.collect || 0 }}</div>
                <mu-icon value="grade"></mu-icon>
              </mu-button>
            </mu-tooltip>
          </div>
          <!--          评论-->
          <mu-card class="card" id="comment" v-if="info.isComment">
            <Comment @comment="comment" :commentSuccess="commentSuccess" :focusComment="focusComment"></Comment>
          </mu-card>
          <!--          评论列表-->
          <mu-card v-if="info.isComment && commentList.length > 0" class="card">
            <mu-card-title :title="`评论（${info.comment}）`"></mu-card-title>
            <mu-divider></mu-divider>
            <CommentList :list="commentList" :articleId="info._id" :articleTitle="info.title"></CommentList>
          </mu-card>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "../../components/Header.vue";
import Footer from "../../components/Footer.vue";
import RightConfig from "../../components/RightConfig.vue";
import Comment from "../../components/Comment.vue";
import CommentList from "../../components/CommentList.vue"
import Clipboard from 'clipboard'
import {getArticleDetail, addViews, addLikes} from "../../api/articles.ts";
import {updateUserCollectNum} from "../../api/user.ts";
import {comment, getCommentList} from "../../api/comment.ts";
import moment from "moment";

export default {
  name: "articlesDetails",
  components: {
    Header,
    Footer,
    RightConfig,
    Comment,
    CommentList,
  },
  data() {
    return {
      info: {},
      toc: [],
      commentSuccess: false,
      commentList: [],
      userInfo: JSON.parse(localStorage.getItem('userInfo')),
    }
  },
  mounted() {
    document.body.scrollIntoView({
      block: 'start',
      behavior: 'smooth'
    })
    this.getArticleDetail().then(() => {
      this.getCommentList()
    })
    this.addViews()
    this.$nextTick(() => {
      let clipboard = new Clipboard('.copy-btn')
      clipboard.on('success', () => {
        this.$toast.success('复制成功')
      })
      clipboard.on('error', () => {
        this.$toast.success('复制失败')
      })
    })
  },
  methods: {
    async comment(data) {
      const res = await comment({
        targetReplayId: "",
        targetReplayContent: "",
        currentReplayContent: data.content,
        avatar: this.userInfo.avatar,
        email: this.userInfo.email,
        nickName: this.userInfo.nickName,
        articleId: this.$route.query.id,
        articleTitle: this.info.title,
      })
      if (res.code === 200) {
        this.commentSuccess = true
        this.$toast.success(res.msg)
        location.reload()
      }
    },
    listToTree(list) {
      let info = list.reduce(
          (map, node) => ((map[node._id] = node), (node.children = []), map),
          {}
      );
      return list.filter((node) => {
        info[node.targetReplayId] &&
        info[node.targetReplayId].children.push(node);
        return !node.targetReplayId;
      });
    },
    async getArticleDetail() {
      const res = await getArticleDetail(this.$route.query.id)
      if (res.code === 200) {
        const handleRes = res.data
        handleRes.createTime = moment(handleRes.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')
        this.info = handleRes
      }
    },
    async addViews() {
      await addViews(this.$route.query)
    },
    async collect() {
      const res = await updateUserCollectNum({
        articleId: this.$route.query.id,
        email: JSON.parse(localStorage.getItem('userInfo')).email,
        addCollect: true
      })
      if (res.code === 200) {
        await this.getArticleDetail()
      } else {
        this.$toast.info(res.msg)
      }
    },
    async getCommentList() {
      const res = await getCommentList({
        auditStatus: '0', // 全部
        articleId: this.$route.query.id,
      })
      if (res.code === 200) {
        const handleRes = res.data.list
        handleRes.map(item => {
          item.commentTime = moment(item.commentTime * 1000).format('YYYY-MM-DD HH:mm:ss')
        })
        this.commentList = this.listToTree(handleRes)
      }
    },
    toComment() {
      this.$refs.comment.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    focusComment(ref) {
      ref.focus()
    },
    async like() {
      const res = await addLikes(this.$route.query)
      if (res.code === 200) {
        await this.getArticleDetail()
      }
    }
  },
  watch: {
    '$route.query.id': {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          location.reload()
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.details {
  padding-top: 64px;
}

.toc-fixed {
  position: fixed;
  width: 20%;
  right: 20px;
  top: 80px;

  .toc {
    width: 100%;
    max-height: 400px;
    overflow-y: auto;
    word-break: break-all; //强制英文单词断行
    padding: 0.2rem 0 0.2rem 0.2rem;

    .title {
      font-size: 0.4rem;
      margin-bottom: 10px;
    }

    a {
      display: inline-block;
      color: #2196f3;
      font-size: 0.32rem;
      cursor: pointer;
      padding: 5px 0;

      &:hover {
        color: #00e676;
      }
    }
  }
}

.action-list {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0.42667rem 0;
}

.action {
  margin-top: 0.42667rem;
  display: flex;
  justify-content: space-around;
}

.noContents {
  flex-direction: column;
  align-items: center;
  height: 400px;
}

.content {
  padding-bottom: 0.53333rem;
  display: flex;

  .left {
    flex: 9;
    margin-top: 16px;

    .card {
      position: relative;
      border-radius: 5px;
      margin-bottom: 0.48rem;

      .back-top {
        position: absolute;
        top: 15px;
        right: 5px;
      }

      .article-detail {
        width: 100%;
        padding: 0.42667rem 0.42667rem 0.42667rem 0.69333rem;
        box-sizing: border-box;
        word-break: break-all;
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

@media screen and (min-width: 750px) {
  .cover {
    display: block;
  }

  .left {
    margin-top: 16px;
  }

  .right {
    display: block;
  }

  .toc-fixed {
    display: block;
  }

  .left-box {
    width: 70%;
  }
}

@media screen and (max-width: 750px) {
  .cover {
    display: none;
  }

  .left {
    margin-top: 0;
  }

  .right {
    display: none;
  }

  .toc-fixed {
    display: none;
  }

  .left-box {
    width: 100%;
  }
}

/deep/ .mu-button-wrapper {
  text-transform: lowercase;
}

.right-action-list {
  position: fixed;
  display: flex;
  justify-content: space-around;
  width: 329px;
  height: 250px;
  right: 0;
  bottom: 0;
}

.operationBtn {
  overflow: visible;

  &:after {
    position: absolute;
    bottom: 80%;
    left: 110%;
    width: max-content;
    font-size: 40px;
    font-style: italic;
    font-weight: bolder;
    background-image: linear-gradient(#FFCF02, #FF7352);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transform: translateY(100%);
    opacity: 0;
    visibility: hidden;
    transition: .3s .3s, 0s .6s transform;
    content: '+1';
  }

  &:active:after {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
    transition: .3s;
  }

  .operationBtnContent {
    min-width: 26px;
    height: 26px;
    padding: 0 8px;
    line-height: 26px;
    position: absolute;
    top: -5px;
    left: 35px;
    border-radius: 50%;
    background-color: yellowgreen;
    font-size: 14px;
  }
}

.cursor-default {
  padding: 7px;
  font-size: 16px;
}
</style>