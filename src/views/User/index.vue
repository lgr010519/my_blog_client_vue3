<template>
  <div class="user">
    <mu-card class="slider-card">
      <mu-tooltip content="修改资料" placement="bottom-start">
        <mu-button color="grey600" class="edit" icon @click="openUpdateModal = true">
          <mu-icon value="edit"></mu-icon>
        </mu-button>
      </mu-tooltip>
      <mu-avatar class="avatar" size="100">
        <img v-lazy="userInfo.avatar">
      </mu-avatar>
      <div class="title">{{userInfo.nickName}}</div>
      <div class="email">{{userInfo.email}}</div>
      <div class="desc">{{userInfo.introduction || '此人很懒，什么也没留下。'}}</div>
    </mu-card>
    <UpdateUserForm :userInfo.sync="userInfo" :open="openUpdateModal" @toggle="toggleUpdateModal"></UpdateUserForm>
    <div class="right">
      <mu-appbar class="title">
        <mu-button icon slot="left" @click="$router.go(-1)">
          <mu-icon value="arrow_back"></mu-icon>
        </mu-button>
        我的收藏
        <mu-menu slot="right">
          <mu-button icon>
            <mu-icon value="menu"></mu-icon>
          </mu-button>
          <mu-list slot="content">
            <mu-list-item button @click="cancelCollect(null)">
              <mu-list-item-title>一键取消收藏</mu-list-item-title>
            </mu-list-item>
          </mu-list>
        </mu-menu>
      </mu-appbar>
      <div class="wrapper">
        <div v-if="collectList.length > 0" class="card-box">
          <mu-card class="card" v-for="item in collectList" :key="item._id">
            <mu-card-media :title="item.title" @click="goDetail(item)" style="cursor: pointer;">
              <img :src="item.cover" alt="">
            </mu-card-media>
            <mu-card-text class="introduction" @click="goDetail(item)">{{item.introduction}}</mu-card-text>
            <mu-card-actions class="action">
              <mu-button flat color="pink500" @click="cancelCollect(item._id)">
                <mu-icon value="remove_circle"></mu-icon>
                取消收藏
              </mu-button>
              <mu-button class="likeBtn" flat color="primary" @click="like(item._id)">
                <mu-icon value="thumb_up"></mu-icon>
                点赞
              </mu-button>
            </mu-card-actions>
          </mu-card>
        </div>
        <div v-else class="empty-text">此处空空如也......</div>
      </div>
    </div>
  </div>
</template>

<script>
    import UpdateUserForm from '@/components/UpdateUserForm'
    import {getUserInfo, getCollectArticles, updateUserCollectNum} from "@/api/user";
    import {addLikes} from "@/api/articles";

    export default {
        name: "user",
        components: {
            UpdateUserForm,
        },
        data() {
            return {
                openUpdateModal: false,
                collectList: [],
                userInfo: {},
            }
        },
        mounted() {
            this.getUserInfo().then(async () => {
                const res = await getCollectArticles({
                    articleIds: this.userInfo.articleIds
                })
                if (res.code === 200) {
                    const handleRes = res.data.collectArticles
                    handleRes.sort((a, b) => b.createTime - a.createTime)
                    this.collectList = handleRes
                }
            })
        },
        methods: {
            uploadFile(e) {
                console.log(e)
            },
            goDetail(item) {
                this.$router.push({
                    name: 'articlesDetails',
                    query: {
                        id: item._id
                    }
                })
            },
            async cancelCollect(id) {
                const res = await updateUserCollectNum({
                    articleId: id,
                    email: JSON.parse(localStorage.getItem('userInfo')).email,
                    reduceCollect: !!id,
                    reduceCollectAll: !id,
                })
                if (res.code === 200) {
                    this.$toast.success(res.msg)
                    setTimeout(() => {
                        location.reload()
                    }, 600)
                }
            },
            toggleUpdateModal(bool) {
                this.openUpdateModal = bool
            },
            async getUserInfo() {
                const res = await getUserInfo({id: JSON.parse(localStorage.getItem('userInfo'))._id})
                if (res.code === 200) {
                    this.userInfo = res.data.userInfo
                    localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
                }
            },
            async like(id) {
                await addLikes({id})
            }
        }
    }
</script>

<style lang="less" scoped>
  .user {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    .slider-card {
      width: 17%;
      height: 100%;
      position: fixed;
      text-align: center;
      padding: 16px;
      z-index: 9999;

      .edit {
        position: absolute;
        right: 40px;
        top: 20px;
      }

      .avatar {
        cursor: pointer;
        margin-top: 20px;
        box-shadow: 0 3px 3px -2px rgb(0 0 0 / 20%), 0 3px 4px 0 rgb(0 0 0 / 14%), 0 1px 8px 0 rgb(0 0 0 / 12%);
      }

      .file {
        width: 100px;
        height: 100px;
        opacity: 0;
        position: absolute;
        cursor: pointer;
      }

      .title {
        font-size: 20px;
        color: #2195f2;
      }

      .email {
        font-size: 16px;
      }

      .desc {
        font-size: 14px;
        margin: 10px 0;
        text-align: center;
      }
    }
  }

  .right {
    flex: 1;

    .wrapper {
      padding-top: 100px;

      .card-box {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin-left: 350px;
      }

      .empty-text {
        margin-left: 17%;
        margin-top: 250px;
        text-align: center;
        font-size: 18px;
        color: #cccccc;
      }

      .card {
        width: 100%;
        margin-right: 5%;
        margin-bottom: 40px;
        max-width: 6rem;

        &:hover {
          transform: scale(1.1);
          transition: all .6s;
        }

        .mu-card-media {
          img {
            height: 5rem;
          }
        }
      }
    }
  }

  .introduction {
    height: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    cursor: pointer;
  }

  .action {
    display: flex;
    justify-content: space-around;
  }

  /deep/ .mu-menu {
    height: 75%;
  }

  /deep/ .mu-appbar {
    position: fixed;
    right: 0;
    width: 83%;
  }

  .likeBtn {
    position: relative;
    overflow: visible;

    &:after {
      position: absolute;
      bottom: 100%;
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
  }
</style>