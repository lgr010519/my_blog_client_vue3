<script lang="ts" setup>
import {getArticles} from "../../api/articles";
import moment from "moment"
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import Header from '../../components/Header.vue'
import RightConfig from '../../components/RightConfig.vue'

const router = useRouter()

const info = ref({})
const page = ref(1)
const pageSize = ref(6)

onMounted(() => {
	handleGetArticles()
})

const goDetail = (item: { _id: any; }) => {
	router.push({
		name: 'articlesDetails',
		query: {
			id: item._id
		}
	})
}

const handleGetArticles = async () => {
	const res: any = await getArticles({
		page: page.value,
		pageSize: pageSize.value,
		status: 1, // 文章为启用状态
		publishStatus: 1, // 文章为发布状态
	})
	if (res.code === 200) {
		const handleRes = res.data
		handleRes.list.map((item: { createTime: any }) => {
			item.createTime = moment(item.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')
		})
		info.value = handleRes
	}
}

const pageChange = (pg: number) => {
	page.value = pg
	getArticles({
		page: page.value,
		pageSize: pageSize.value,
		status: 1, // 文章为启用状态
		publishStatus: 1, // 文章为发布状态
	}).then(() => {
		document.body.scrollIntoView({
			block: 'start',
			behavior: 'smooth'
		})
	})
}
</script>

<template>
	<div class="articles">
		<Header :light-index="1"></Header>
		<div class="content">
			<div class="right">
				<RightConfig></RightConfig>
			</div>
			<div class="wap-left left">
				<el-card @click="goDetail(item)" class="card" v-for="item in info.list" :key="item._id">
					<div class="cover">
						<img class="cover-img" :src="item.cover">
					</div>
					<div class="card-box">
						<div class="title">{{ item.title }}</div>
						<div class="sub-title">
							<el-button class="cursor-default" text color="rgb(154,205,50)">查看（{{ item.views }}）
							</el-button>
							<el-button class="cursor-default" text color="rgb(33,150,243)" v-if="item.isLike">
								点赞（{{ item.like }}）
							</el-button>
							<el-button class="cursor-default" text color="rgb(156,39,176)" v-if="item.isCollect">
								收藏（{{ item.collect }}）
							</el-button>
							<el-button class="cursor-default" text color="rgb(244,67,54)" v-if="item.isComment">
								评论（{{ item.comment }}）
							</el-button>
							<el-button class="cursor-default" text color="#9e9e9e">{{ item.createTime }}</el-button>
						</div>
						<div class="text">
							{{ item.introduction }}
						</div>
						<div>
							<el-button class="cursor-default chip" text type="primary">
								<el-icon>
									<Operation/>
								</el-icon>
								{{ item.categories }}
							</el-button>
							<br/>
							<el-button v-for="sub in item.tags" :key="sub" class="cursor-default chip" text>
								<el-icon>
									<Promotion/>
								</el-icon>
								{{ sub }}
							</el-button>
						</div>
					</div>
				</el-card>
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
					display: inline-block;
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
					display: inline-block;
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

:deep(.mu-button-wrapper) {
	text-transform: lowercase;
}

:deep(.el-card__body) {
	padding: 0;
}
</style>