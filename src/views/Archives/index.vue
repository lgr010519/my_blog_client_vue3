<template>
  <div class="common" :style="{background:`url(${archiveBg}) center center no-repeat`,backgroundSize:'cover'}">
    <Header :light-index="2" background="transparent"></Header>
    <div class="content">
      <ul class="timeline timeline-centered">
        <li class="timeline-item period">
          <div class="timeline-info"></div>
          <div class="timeline-content year">
            <div class="timeline-marker"></div>
            <h1 class="timeline-title year">2023</h1>
          </div>
        </li>
        <li class="timeline-item" v-for="item in articles" :key="item._id">
          <div class="timeline-info">
            <span>{{item.createTime}}</span>
          </div>
          <div class="timeline-content" @click="goDetail(item._id)">
            <div class="timeline-marker"></div>
            <h2 class="timeline-title">{{item.title}}</h2>
            <p>{{item.introduction}}</p>
          </div>
        </li>
      </ul>
      <Footer></Footer>
    </div>
  </div>
</template>

<script>
    import Header from "../../components/Header.vue";
    import Footer from "../../components/Footer.vue";
    import {getArticles} from "../../api/articles.ts";
    import moment from "moment";

    export default {
        name: "archives",
        components: {
            Header,
            Footer,
        },
        data() {
            return {
                archiveBg: require('../../assets/archiveBg.png'),
                articles: [],
            }
        },
        mounted() {
            this.getArticles()
        },
        methods: {
            async getArticles() {
                const res = await getArticles({
                    page: 1,
                    pageSize: 9999,
                    status: 1,
                    publishStatus: 1,
                })
                if (res.code === 200) {
                    const handleRes = res.data.list
                    handleRes.map(item => {
                        item.createTime = moment(item.createTime * 1000).format('MM-DD')
                    })
                    this.articles = handleRes
                }
            },
            goDetail(id) {
                this.$router.push({
                    name: 'articlesDetails',
                    query: {id}
                })
            }
        }
    }
</script>

<style lang="less" scoped>
  .content {
    position: absolute;
    top: 64px;
    bottom: 0;
    overflow: auto;
    width: 100%;
    padding-top: 20px;
  }

  .timeline {
    line-height: 1.4em;
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: inherit;
    }
  }

  .timeline-item {
    padding-left: 40px;
    position: relative;

    &:last-child {
      padding-bottom: 0;
    }
  }

  .timeline-info {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 3px;
    margin: 0 0 0.5em 0;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .timeline-marker {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 15px;

    &:before {
      background: transparent;
      border: 3px solid #2195f2;
      border-radius: 100%;
      content: "";
      display: block;
      height: 15px;
      position: absolute;
      top: 4px;
      left: 0;
      width: 15px;
      transition: background 0.3s ease-in-out, border 0.3s ease-in-out;
    }

    &:after {
      content: "";
      width: 3px;
      background: #ccd5db;
      display: block;
      position: absolute;
      top: 24px;
      bottom: 0;
      left: 6px;
    }

    .timeline-item:last-child &:after {
      content: none;
    }
  }

  .timeline-content:not(.year):hover .timeline-marker:before {
    background: #2195f2;
    border: 3px solid #2195f2;
  }

  .timeline-content {
    padding-bottom: 40px;
    color: #fff;

    p:last-child {
      margin-bottom: 0;
    }
  }
  .timeline-content:not(.year){
    cursor: pointer;
  }

  .period {
    padding: 0;

    .timeline-info {
      display: none;
    }

    .timeline-marker {
      &:before {
        background: transparent;
        content: "";
        width: 15px;
        height: auto;
        border: none;
        border-radius: 0;
        top: 0;
        bottom: 30px;
        position: absolute;
        border-top: 3px solid #ccd5db;
        border-bottom: 3px solid #ccd5db;
      }

      &:after {
        content: "";
        height: 32px;
        top: auto;
      }
    }

    .timeline-content {
      padding: 40px 0 70px;
    }

    .timeline-title {
      margin: 0;
    }
  }

  .timeline-split {
    @media (min-width: 768px) {
      .timeline {
        display: table;
      }

      .timeline-item {
        display: table-row;
        padding: 0;
      }

      .timeline-info,
      .timeline-marker,
      .timeline-content,
      .period .timeline-info {
        display: table-cell;
        vertical-align: top;
      }

      .timeline-marker {
        position: relative;
      }

      .timeline-content {
        padding-left: 30px;
      }

      .timeline-info {
        padding-right: 30px;

        span {
          color: #fff;
        }
      }

      .period .timeline-title {
        position: relative;
        left: -45px;
      }
    }
  }

  .timeline-centered {
  @extend . timeline-split;
    @media (min-width: 992px) {
      &,
      .timeline-item,
      .timeline-info,
      .timeline-marker,
      .timeline-content {
        display: block;
        margin: 0;
        padding: 0;
      }

      .timeline-item {
        padding-bottom: 60px;
        overflow: hidden;
      }

      .timeline-marker {
        position: absolute;
        left: 50%;
        margin-left: -7.5px;
      }

      .timeline-info,
      .timeline-content {
        width: 50%;
        color: #fff;
        transition: all .6s;
      }
      .timeline-content:not(.year):hover{
        color: rgb(33,149,242);
      }

      > .timeline-item:nth-child(odd) .timeline-info {
        float: left;
        text-align: right;
        padding-right: 30px;
      }

      > .timeline-item:nth-child(odd) .timeline-content {
        float: right;
        text-align: left;
        padding-left: 30px;
      }

      > .timeline-item:nth-child(even) .timeline-info {
        float: right;
        text-align: left;
        padding-left: 30px;
      }

      > .timeline-item:nth-child(even) .timeline-content {
        float: left;
        text-align: right;
        padding-right: 30px;
      }

      > .timeline-item.period .timeline-content {
        float: none;
        padding: 0;
        width: 100%;
        text-align: center;
      }

      .timeline-item.period {
        padding: 50px 0 90px;
      }

      .period .timeline-marker:after {
        height: 30px;
        bottom: 0;
        top: auto;
      }

      .period .timeline-title {
        left: auto;
      }
    }
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.4);

    &:hover {
      background: rgba(255, 255, 255, 0.6);
    }
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(255, 255, 255, 0.2);
  }
</style>