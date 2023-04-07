<template>
  <div class="common" :style="{background:`url(${categoryBg}) center center no-repeat`,backgroundSize:'cover'}">
    <Header :light-index="3" background="transparent"></Header>
    <div class="PC-footer">
      <Footer fixed></Footer>
    </div>
    <div class="content mobile-content">
      <div class="cols">
        <div class="cols-item" @click="goDetails('技术')">
          <div class="container">
            <div class="front" :style="{backgroundImage: `url(${require('@/assets/technology.png')})`}">
              <div class="inner">
                <p>技术</p>
                <span>{{totalCountTechnology}}</span>
              </div>
            </div>
            <div class="back" :style="{backgroundImage: `url(${require('@/assets/technology.png')})`}">
              <div class="inner">
                <p>技术</p>
                <span>{{totalCountTechnology}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="cols-item" @click="goDetails('生活')">
          <div class="container">
            <div class="front" :style="{backgroundImage: `url(${require('@/assets/life.png')})`}">
              <div class="inner">
                <p>生活</p>
                <span>{{totalCountLive}}</span>
              </div>
            </div>
            <div class="back" :style="{backgroundImage: `url(${require('@/assets/life.png')})`}">
              <div class="inner">
                <p>生活</p>
                <span>{{totalCountLive}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="cols-item" @click="goDetails('工作')">
          <div class="container">
            <div class="front" :style="{backgroundImage: `url(${require('@/assets/photo.png')})`}">
              <div class="inner">
                <p>工作</p>
                <span>{{totalCountWork}}</span>
              </div>
            </div>
            <div class="back" :style="{backgroundImage: `url(${require('@/assets/photo.png')})`}">
              <div class="inner">
                <p>工作</p>
                <span>{{totalCountWork}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="cols-item" @click="goDetails('其他')">
          <div class="container">
            <div class="front" :style="{backgroundImage: `url(${require('@/assets/others.png')})`}">
              <div class="inner">
                <p>其他</p>
                <span>{{totalCountOthers}}</span>
              </div>
            </div>
            <div class="back" :style="{backgroundImage: `url(${require('@/assets/others.png')})`}">
              <div class="inner">
                <p>其他</p>
                <span>{{totalCountOthers}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mobile-footer">
        <Footer></Footer>
      </div>
    </div>
  </div>
</template>

<script>
    import Header from "../../components/Header.vue";
    import Footer from "../../components/Footer.vue";
    import {getCategories, getArticlesByCategories} from "../../api/categories.ts";

    export default {
        name: "categories",
        components: {
            Header,
            Footer,
        },
        data() {
            return {
                categoryBg: require('../../assets/tags.jpeg'),
                totalCountTechnology: 0,
                totalCountLive: 0,
                totalCountWork: 0,
                totalCountOthers: 0,
                otherCategories: '',
            }
        },
        mounted() {
            this.getCategories().then(() => {
                this.getArticlesByCategories({
                    categories: '技术',
                    page: 1,
                    pageSize: 9999
                })
                this.getArticlesByCategories({
                    categories: '生活',
                    page: 1,
                    pageSize: 9999
                })
                this.getArticlesByCategories({
                    categories: '工作',
                    page: 1,
                    pageSize: 9999
                })
                this.getArticlesByCategories({
                    categories: this.otherCategories,
                    page: 1,
                    pageSize: 9999
                })
            })
        },
        methods: {
            goDetails(categories) {
                if (categories !== '其他') {
                    this.$router.push({
                        name: 'categoriesDetails',
                        query: {
                            categories
                        }
                    })
                } else {
                    this.$router.push({
                        name: 'categoriesDetails',
                        query: {
                            categories,
                            otherCategories: this.otherCategories
                        }
                    })
                }
            },
            async getArticlesByCategories(categories) {
                const res = await getArticlesByCategories(categories)
                if (res.code === 200) {
                    if (categories.categories === '技术') {
                        this.totalCountTechnology = res.data.totalCount
                    } else if (categories.categories === '生活') {
                        this.totalCountLive = res.data.totalCount
                    } else if (categories.categories === '工作') {
                        this.totalCountWork = res.data.totalCount
                    } else {
                        this.totalCountOthers = res.data.totalCount
                    }
                }
            },
            async getCategories() {
                const res = await getCategories({
                    page: 1,
                    pageSize: 9999
                })
                if (res.code === 200) {
                    const handleRes = res.data.list.map(item => item.name)
                    handleRes.map((item, index) => {
                        if (item === '技术' || item === '生活' || item === '工作') {
                            handleRes.splice(index, 1)
                        }
                    })
                    handleRes.splice(0, 1)
                    this.otherCategories = handleRes.join(',')
                }
            }
        }
    }
</script>

<style lang="less" scoped>
  @media screen and (min-width: 750px) {
    .PC-footer {
      display: block;
    }

    .mobile-footer {
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

    .mobile-footer {
      display: block;
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

  .cols {
    width: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
  }

  .cols-item {
    width: calc(25% - 32px);
    margin: 16px;
    cursor: pointer;
  }

  .container {
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    -webkit-perspective: 1000px;
    perspective: 1000px;
  }

  .front,
  .back {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    -webkit-transition: -webkit-transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
    transition: -webkit-transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
    -o-transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
    transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
    transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1),
    -webkit-transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    text-align: center;
    min-height: 200px;
    height: auto;
    border-radius: 10px;
    color: #fff;
    font-size: 24px;
  }

  .back {
    background: #cedce7;
    background: -webkit-linear-gradient(45deg, #cedce7 0%, #596a72 100%);
    background: -o-linear-gradient(45deg, #cedce7 0%, #596a72 100%);
    background: linear-gradient(45deg, #cedce7 0%, #596a72 100%);
    background-repeat: no-repeat;
  }

  .front:after {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    content: "";
    display: block;
    opacity: 0.6;
    background-color: #000;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    border-radius: 10px;
  }

  .container:hover .front,
  .container:hover .back {
    -webkit-transition: -webkit-transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
    transition: -webkit-transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
    -o-transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
    transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
    transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1),
    -webkit-transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
  }

  .back {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  .inner {
    -webkit-transform: translateY(-50%) translateZ(60px) scale(0.94);
    transform: translateY(-50%) translateZ(60px) scale(0.94);
    top: 50%;
    position: absolute;
    left: 0;
    width: 100%;
    padding: 32px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 1px solid transparent;
    -webkit-perspective: inherit;
    perspective: inherit;
    z-index: 2;
  }

  .container .back {
    -webkit-transform: rotateY(180deg);
    transform: rotateY(180deg);
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
  }

  .container .front {
    -webkit-transform: rotateY(0deg);
    transform: rotateY(0deg);
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
  }

  .container:hover .back {
    -webkit-transform: rotateY(0deg);
    transform: rotateY(0deg);
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
  }

  .container:hover .front {
    -webkit-transform: rotateY(-180deg);
    transform: rotateY(-180deg);
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
  }

  .front .inner p {
    font-size: 32px;
    margin-bottom: 32px;
    position: relative;
  }

  .front .inner p:after {
    content: "";
    width: 64px;
    height: 2px;
    position: absolute;
    background: #c6d4df;
    display: block;
    left: 0;
    right: 0;
    margin: 0 auto;
    bottom: -12px;
  }

  .front .inner span {
    color: rgba(255, 255, 255, 0.7);
    font-family: "Montserrat";
    font-weight: 300;
  }

  @media screen and (max-width: 664px) {
    .cols-item {
      width: calc(33.333333% - 32px);
    }
  }

  @media screen and (max-width: 768px) {
    .cols-item {
      width: calc(50% - 32px);
    }
  }

  @media screen and (max-width: 512px) {
    .cols-item {
      width: 80%;
      margin: 0 0 32px 0;
    }
  }
</style>