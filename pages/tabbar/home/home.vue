<template>
	<view class="home-page">
		<!-- 头部搜索 -->
		<view class="content-header" :style="searchBarBg">
			<view class="iconfont icon-fenlei fl" @click="navigateTo('category')"></view>
			<view class="search-input ">
				<view class="msSearchBox" @click="search()">
					<view class="iconfont icon-sousuo sousuo" style="color:#ccc"></view>
					<view class="searchWords">
						<swiper style="height:40rpx;" :indicator-dots="false" autoplay :interval="3000" :duration="200"
							vertical circular>
							<swiper-item style="height: 40rpx;" v-for="(item, index) in searchHotWords" :key="index">
								<text>{{ item.queryName }}</text>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
			<view class="iconfont icon-yonghu" style="color:#fff;cursor: pointer;" @click="navigateTo('user')"></view>
		</view>
		<!-- 轮播图片 -->
		<view class="swiper-bg">
			<swiper class="swiper" :indicator-dots="false" :autoplay="true" :interval="4000" :duration="200"
				:circular="true" @change="swiperChange">
				<swiper-item v-for="(item,index) in swiperList" :key="item.iid">
					<view class="swiper-item">
						<image :src="item.item.pic_url" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="swiper_dots_box">
				<view class="swiper_dots">
					<view v-for="(item, index) in swiperList.length" :key="index"
						:class="['dots_item', index == swiperCurrent ? 'dots_active' : '']"></view>
				</view>
			</view>
		</view>
		<!-- 页面内容 -->
		<view class="page_bg">
			<!-- 金刚区导航 -->
			<view class="navigation_box">
				<view class="flex-center navigation" v-for="item in cateList" :key="item.iid"
					@click="kingKong(item.item.title)">
					<image :src="item.item.pic_url"></image>
					<view>{{ item.item.title }}</view>
				</view>
			</view>
			<!-- 广告上部分 -->
			<view class="mid-ad" v-if="midAdTop">
				<image :src="midAdTop" @click="showToast('中部广告')"></image>
			</view>
			<!-- 中部广告 -->
			<view class="mid-ad" v-if="midAd">
				<image :src="midAd" @click="showToast('中部广告')"></image>
			</view>
			<!-- 活动区域 -->
			<view class="floor">
				<!-- 新人优惠 -->
				<view class="red_packets" @click="showToast('新人优惠')">
					<image v-for="(item, index) in newUserAd" :key="index" :src="item.item.pic_url"></image>
				</view>
				<!-- 众筹模块 -->
				<view class="zhongchou card">
					<view class="head">
						<view class="title">微淘众筹</view>
						<view class="more">
							<text>更多</text>
							<u-icon name="arrow-right" size="20"></u-icon>
						</view>
					</view>
					<image :src="funding.bg" class="fundingBg"></image>
					<view class="fitem" v-if="funding.fitem">
						<view class="item" @click="goToDetail(funding.fitem.gid)">
							<view class="desc">
								<view class="title">{{ funding.fitem.name }}</view>
								<view class="sub">{{ funding.fitem.summary }}</view>
								<view class="price">
									<text>￥</text>
									<text>{{ funding.fitem.market_price / 100 }}</text>
								</view>
								<view class="count">
									<view class="tag" :style="{ background: funding.fitem.tags[0].color }">
										{{ funding.fitem.tags[0].name }}
									</view>
									<text>支持人数</text>
									<text class="num">{{ funding.fitem.saled_count }}</text>
									<text>/</text>
									<text>完成度</text>
									<text class="num">{{ funding.fitem.progress }}</text>
									<text class="num">%</text>
								</view>
							</view>
							<image :src="funding.fitem.pic_url" class="img"></image>
						</view>
						<view class="progress pro-fitem">
							<view class="complete"
								:style="{ width: funding.fitem.progress > 100 ? '100' : funding.fitem.progress + '%' }">
								<view class="full-color pro-fitem"></view>
							</view>
						</view>
					</view>
					<view class="sitem">
						<view class="item" v-for="(item, index) in funding.slist" :key="index"
							@click="goToDetail(item.gid)">
							<view class="title">{{ item.name }}</view>
							<view class="desc">
								<view class="price">
									<text>￥</text>
									<text>{{ item.market_price / 100 }}</text>
								</view>
								<image :src="item.pic_url" class="img"></image>
							</view>
							<view class="count">
								<view class="tag" :style="{ background: item.tags[0].color }">{{ item.tags[0].name }}
								</view>
								<text>支持人数</text>
								<text class="num">{{ item.saled_count }}</text>
							</view>
							<view class="progress pro-sitem">
								<view class="complete"
									:style="{ width: item.progress > 100 ? '100' : item.progress + '%' }">
									<view class="full-color pro-sitem"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 好物榜 -->
				<view class="haowu card">
					<view class="head">
						<view class="title">好物榜</view>
					</view>
					<view class="list" v-if="rankList.length">
						<view class="item" @click="goToDetail(rankList[0].data.goods.gid)">
							<image class="goodsImg" :src="rankList[0].data.goods.img800"></image>
							<view class="desc">
								<view>{{ rankList[0].data.goods.newCname2 }}</view>
								<view>99%好评率</view>
							</view>
							<image class="bg" :src="rankListImg.comment"></image>
						</view>
						<swiper class="item" :indicator-dots="false" :autoplay="true" :interval="3000" :duration="200"
							vertical circular>
							<swiper-item>
								<view @click="goToDetail(rankList[1].data.goods.gid)">
									<image class="goodsImg" :src="rankList[1].data.goods.img800"></image>
									<view class="desc">
										<view>{{ rankList[1].data.goods.newCname2 }}</view>
										<view>人气指数1000</view>
									</view>
									<image class="bg" :src="rankListImg.popularity"></image>
								</view>
							</swiper-item>
							<swiper-item>
								<view @click="goToDetail(rankList[3].data.goods.gid)">
									<image class="paihangImg" :src="rankList[3].data.goods.img800"></image>
									<view class="subTitle">24小时最热</view>
									<view class="desc" style="color: #fff;">
										<view>微淘排行榜</view>
										<view>今日销量爆品</view>
									</view>
									<image class="bg paihangBg" :src="rankListImg.rank"></image>
								</view>
							</swiper-item>
						</swiper>
						<view class="item" @click="goToDetail(rankList[2].data.goods.gid)">
							<image class="goodsImg" :src="rankList[2].data.goods.img800"></image>
							<view class="desc">
								<view>{{ rankList[2].data.goods.newCname2 }}</view>
								<view>热销指数1000</view>
							</view>
							<image class="bg" :src="rankListImg.sell"></image>
						</view>
					</view>
				</view>
				<!-- 热销榜 -->
				<view class="rexiao card">
					<view class="head">
						<view class="title">热销榜</view>
						<view class="subTitle">排序由销量、搜索、好评等综合得出</view>
						<view class="more">
							<text>更多</text>
							<u-icon name="arrow-right" size="20"></u-icon>
						</view>
					</view>
					<scroll-view scroll-x :show-scrollbar="false">
						<view class="scoll-wrapper">
							<view class="goods" v-for="(item, index) in rexiaoList" :key="index"
								@click="goToDetail(item.item.gid)">
								<image class="labelImg"
									:src="`https://img.youpin.mi-img.com/static/weex_images/v1/LeaderboardNO${index + 1}.png@base@tag=imgScale&h=48&w=44`">
								</image>
								<image class="goodsImg" :src="item.item.imgs.img800"></image>
								<view class="label">{{ item.item.recommend }}</view>
								<view class="desc">{{ item.item.name }}</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<!-- 秒杀列表 -->
				<view class="miaosha card">
					<view class="head">
						<view class="title">限时购</view>
						<view class="changci">{{ seckillSession }}点场</view>
						<u-count-down class="countDown" :timestamp="timestamp" :show-days="false" color="#fff"
							bg-color="#cb943b" font-size="26" height="32" separator-color="#cb943b"></u-count-down>
						<view class="more">
							<text>更多</text>
							<u-icon name="arrow-right" size="20"></u-icon>
						</view>
					</view>
					<scroll-view scroll-x :show-scrollbar="false">
						<view class="scoll-wrapper" v-if="timeLimit.goods">
							<view class="goods" v-for="(item, index) in timeLimit.goods" :key="index"
								@click="goToDetail(item.item.gid)">
								<image :src="item.item.imgs.img_square"></image>
								<view class="price">
									<text>￥</text>
									<text>{{ item.item.flash_price / 100 }}</text>
									<text>￥{{ item.item.market_price / 100 }}</text>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<!-- 特色频道 -->
				<view class="channel card" v-if="channelList">
					<view class="item" v-for="(item, index) in channelList" :key="index"
						@click="showToast(item.item.title)">
						<view class="mainTitle">{{ item.item.title }}</view>
						<view class="subTitle">{{ item.item.subtitle }}</view>
						<image :src="item.item.pic_url1"></image>
					</view>
				</view>
			</view>
			<!-- 首页推荐商品 -->
			<view>
				<u-sticky :offset-top="navBarHight" bg-color="transprent" @fixed="cateBg = '#fff'"
					@unfixed="cateBg = 'transprent'">
					<scroll-view scroll-x :show-scrollbar="false" class="goods_cat" id="goods-cate"
						:style="{ backgroundColor: cateBg }" :scroll="false">
						<view class="box">
							<view @click="changeTab(index)"
								:class="['detail', goodsCurrentIndex == index ? 'active' : '']"
								v-for="(item, index) in cateTabList" :key="index">
								<view>{{ item.tabConfig.title || item.title }}</view>
								<view>{{ item.tabConfig.subtitle }}</view>
							</view>
						</view>
					</scroll-view>

				</u-sticky>
				<view class="changeTabLoading" v-show="changeTabLoading" :style="[{ height: loadingHeight + 'px' }]">
					<full-loading></full-loading>
				</view>
				<view class="goodslist">
					<view class="item" v-for="(item, index) in goodsList" :key="index"
						@click="goToDetail(item.data.goods.gid)">
						<image :src="item.data.goods.imgSquare" lazy-load />
						<view class="labelbox">
							<text v-for="(litem, lindex) in item.data.goods.labels" :key="lindex"
								:style="{ backgroundColor: litem.attrs.bgColor }">{{ litem.text }}</text>
						</view>
						<view class="title">{{ item.data.goods.name }}</view>
						<view class="subtitle">{{ item.data.goods.summary }}</view>
						<view class="price">
							<text>￥</text>
							<text class="priceMin">{{ item.data.goods.priceMin / 100 }}</text>
							<text class="spec" v-if="item.data.goods.priceTag">起</text>
							<text class="marketPrice"
								v-if="item.data.goods.priceMin != item.data.goods.marketPrice">￥{{ item.data.goods.marketPrice / 100 }}</text>
						</view>
						<image src="../../../static/icon/menu/mini_menu.png"></image>
						<view class="menu">
							<!-- <view>
								<image src="../../../static/icon/menu/buganxingqu.png"></image>
								<text>不感兴趣</text>
							</view>
							<view>
								<image src="../../../static/icon/menu/buxihuan.png"></image>
								<text>品类不喜欢</text>
							</view>
							<view>
								<image src="../../../static/icon/menu/kanguole.png"></image>
								<text>看过了</text>
							</view>
							<view>
								<image src="../../../static/icon/menu/yijinggoumai.png"></image>
								<text>已经购买</text>
							</view> -->
						</view>
					</view>
				</view>
				<view v-show="showLoadmore">
					<u-loadmore :status="loadingStatus" :margin-top="30" :margin-bottom="20" bg-color="#f9f9f9"
						font-size="24" :load-text="loadingText" />
				</view>
			</view>
		</view>
		<view class="pageLoading" v-show="fullLoading"><full-loading></full-loading></view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import fullLoading from '@/components/full-loading.vue'
	export default {
		data() {
			return {
				swiperCurrent: 0,
				searchHotWords: [],
				swiperList: [],
				cateList: [],
				midAdTop: '',
				midAd: '',
				newUserAd: [],
				smallBanner: [],
				funding: {},
				fundingCount: 0,
				rankList: [],
				rexiaoList: [],
				timeLimit: {},
				channelList: [],
				goodsCurrentIndex: 0,
				cateTabList: [],
				goodsList: [],
				fullLoading: true,
				navBarHight: 0,
				goodsIndex: 0,
				cateBg: '',
				changeTabLoading: false,
				loadingHeight: 0,
				loadingStatus: 'loadmore',
				goodsQueryId: '',
				loadingText: {
					loadmore: '上拉加载更多',
					loading: '努力加载中~',
					nomore: '没有更多商品了'
				},
			}
		},
		components: {
			fullLoading
		},
		onLoad() {
			console.log('应用启动')
			// console.log('当前图片网络地址为：' + this.imgUrl)
			this.getHomePageData()
			// 设置背景颜色为第一张轮播图背景色
			// this.top_bgc.backgroundColor = this.bannerList[0].top_bgc
			this.getHotWords()
		},
		onReachBottom() {
			if (this.goodsList.length < 150) {
				this.getGoodsData('more')
				this.loadingStatus = 'loading'
			} else {
				this.loadingStatus = 'nomore'
			}
		},
		computed: {
			searchBarBg() {
				return {
					background: `url('${this.imgUrl}/e6855d30-a420-11ea-9e8b-05a3242b26f2.png') no-repeat top / 100% 100%`
				}
			},
			adBanner() {
				return this.imgUrl + '/41946a10-8061-11ea-b244-a9f5e5565f30.gif'
			},
			rankListImg() {
				return {
					comment: this.imgUrl + '/f9d52d80-8d27-11ea-b997-9918a5dda011.png',
					popularity: this.imgUrl + '/f9dca790-8d27-11ea-b997-9918a5dda011.png',
					sell: this.imgUrl + '/f9d37fd0-8d27-11ea-9e8b-05a3242b26f2.png',
					rank: this.imgUrl + '/f9de5540-8d27-11ea-a30b-e311646dfaf2.png'
				}
			},
			timestamp() {
				var nowDate = Date.now()
				// end_time为秒数,乘以1000变成毫秒,减去当前毫秒数 最后再转换成秒数,让倒计时组件接收
				return (this.timeLimit.end_time * 1000 - nowDate) / 1000
			},
			seckillSession() {
				var date = new Date(this.timeLimit.start_time * 1000)
				return date.getHours()
			},
			showLoadmore() {
				return this.goodsList.length !== 0 ? true : false
			}
		},
		methods: {
			// 获取最近搜索热词
			getHotWords() {
				this.$u.api.placeHolder().then(res => {
					if (res.data.length != 0) {
						this.searchHotWords = res.data
					} else {
						this.searchHotWords.push({
							queryName: '搜一搜'
						})
					}
				}).catch(err => {
					this.searchHotWords.push({
						queryName: '搜一搜'
					})
				})
			},
			// 获取首页全部数据
			getHomePageData() {
				this.$u.api.getHomeData().then(res => {
					this.fullLoading = false;
					if (res.code != 0) return;
					let data = res.data;
					if (data.homepage && data.homepage.floors) {
						this.disposeData(data.homepage.floors)
					}
					// 好物榜楼层
					// 筛选只是商品的数据
					if (data.feeds) {
						let haowuList = data.feeds.items.filter(x => x.type == 'goods');
						let newHaowuList = [] // 随机取四个商品，放进排行榜
						while (newHaowuList.length < 4) {
							let x = Math.floor(Math.random() * haowuList.length)
							if (newHaowuList.indexOf(haowuList[x]) == -1) {
								newHaowuList.push(haowuList[x])
							}
						}
						this.rankList = newHaowuList
						// 商品列表
						this.goodsList = data.feeds.items.filter(x => x.type == 'goods')
					}
				})
			},
			// 处理首页数据数据
			disposeData(item) {
				item.forEach((x, i) => {
					// banner
					if (x.module_key == 'declare_banner_new') {
						this.swiperList = item[i].data.items;
					}
					// 金刚区图标
					else if (x.module_key == 'kingkong_new') {
						this.cateList = item[i].data.items;
					}
					// 上
					else if (x.module_key == 'image_link_map') {
						this.midAd = item[i].data._hotspot.image;
					}
					// 中
					else if (x.module_key == 'single_image_new') {
						this.midAdTop = item[i].data.pic_url;
					}
					// 新人红包
					else if (x.module_key == 'new_user_guide') {
						this.newUserAd = item[i].data.items;
					}
					// 中部小banner
					else if (x.module_key == 'plaza_new') {
						const smallBanner = item[i].data.rows;
						smallBanner.forEach(x => {
							x.items.forEach(s => {
								this.smallBanner.push(s);
							});
						});
					}
					// 众筹模块
					else if (x.module_key == 'crowd_funding_new') {
						this.funding.bg = item[i].data.config.card_bg_image;
						this.funding.fitem = item[i].data.items[0].item;
						this.funding.slist = [];
						// 分割成1个大 + 2个小
						const slist = item[i].data.items.slice(1);
						slist.forEach(x => {
							this.funding.slist.push(x.item);
						});
					}
					// 热销榜
					else if (x.module_key == 'leaderboard_new') {
						this.rexiaoList = item[i].data.items;
					}
					// 限时购
					else if (x.module_key == 'flashsale_new') {
						// console.log(item[i].data,'111111111')
						this.timeLimit = item[i].data;
					}
					// 特色频道
					else if (x.module_key == 'shopping_entrance') {
						this.channelList = item[i].data.items;
					}
					// 推荐商品分类
					else if (x.module_key == 'slide_flow') {
						this.cateTabList = item[i].data.items;
					}
				})
			},
			kingKong(title) {
				if (title == '每日上新') {
					uni.navigateTo({
						url: '/pages/index/new/new'
					})
				} else if (title == '小米众筹') {
					uni.navigateTo({
						url: '/pages/index/crowdFunding/crowdFunding'
					})
				} else if (title == '热销排行') {
					uni.navigateTo({
						url: '/pages/index/hotRank/hotRank'
					})
				} else if (title == 'BEST') {
					uni.navigateTo({
						url: '/pages/index/BEST/BEST'
					})
				} else {
					this.showToast(title)
				}
			},
			changeTab(e) {
				if (e == this.goodsCurrentIndex) return
				this.goodsCurrentIndex = e
				this.goodsIndex = 0
				this.goodsList = []
				if (e == 1) {
					this.goodsQueryId = 'tab_feed_smart_1'
				} else if (e == 2) {
					this.goodsQueryId = 'tab_feed_electric_2'
				} else if (e == 3) {
					this.goodsQueryId = 'tab_feed_life_3'
				} else if (e == 4) {
					this.goodsQueryId = 'tab_feed_fashion_4'
				} else if (e == 5) {
					this.goodsQueryId = 'tab_feed_coupon_5'
				} else {
					this.goodsQueryId = ''
				}
				this.changeTabLoading = true
				this.getGoodsData('initial')
				this.loadingStatus = 'loading'
			},
			getGoodsData(type) {
				// type = initial 初始数据
				// type = more 更多数据
				let data = {
					index: this.goodsIndex,
					query_id: this.goodsQueryId,
				}
				this.$u.api.getHomeFeeds(data).then(res => {
					// console.log(res)
					if (type == 'initial') {
						this.goodsList = res.data.feeds.items.filter(x => x.type == 'goods')
						this.changeTabLoading = false
					} else if (type == 'more') {
						const goodsList = res.data.feeds.items
						goodsList.forEach((x, i) => {
							// 删除不是商品的数据
							if (x.type == 'goods') {
								this.goodsList.push(x)
							}
						})
						this.goodsIndex++
						this.loadingStatus = 'loadmore'
					}

				})
			},
			showToast(title, type = 'success') {
				console.log(title, type)
				this.$refs.uToast.show({
					type: type,
					message: title,
					complete() {
						// params.url && uni.navigateTo({
						// 	url: params.url
						// })
					}
				})
			},
			// 根据轮播图切换背景颜色
			swiperChange(e) {
				// const that = this
				this.swiperCurrent = e.detail.current
				// that.swiper_bgc = this.bannerList[that.swiperCurrent].swiper_bgc
				// that.top_bgc.backgroundColor = this.bannerList[that.swiperCurrent].top_bgc
				// console.log('当前是第'+this.banner[this.current].id+'张轮播图')
			},
			search() {
				uni.navigateTo({
					url: '/pages/shop/search/search'
				})
			},
			goToDetail(gid) {
				uni.navigateTo({
					url: '../../shop/goods/detail/detail?gid=' + gid
				})
			},
			navigateTo(url) {
				console.log(url)
				switch (url) {
					case 'user':
						uni.switchTab({
							url: '../user/user'
						});
						break;
					case 'category':
						uni.switchTab({
							url: '../category/category'
						});
						break;
				}
			},
		}
	}
</script>

<style lang="scss">
	.home-page {
		position: relative;
		width: 100vw;
		// height: 100vh;

		.content-header {
			position: fixed;
			width: 100%;
			height: 100rpx;
			background-color: #b0f1ff;
			display: flex;
			align-items: center;
			padding: 0rpx 20rpx;
			box-sizing: border-box;
			z-index: 99;

			.fl {
				cursor: pointer;
			}

			.iconfont {
				font-size: 60rpx;
			}

			.search-input {
				flex: 1;
				height: 70rpx;
				line-height: 70rpx;
				margin: 0rpx 30rpx;
				background-color: #fff;
				border-radius: 70rpx;
				padding: 0rpx 10rpx;
				box-sizing: border-box;

				.msSearchBox {
					display: flex;
					align-items: center;

					.sousuo {
						font-size: 50rpx;
					}

					.searchWords {
						flex: 1;
						height: 40rpx;
						line-height: 40rpx;
						font-size: 30rpx;
						margin: 0rpx 20rpx;
						color: #ccc;
					}
				}
			}
		}

		.swiper-bg {
			// height: 280rpx;
			// transition-property: background-color;
			// transition-duration: 0.5s;
			// transition: .5s;
			background: url('https://vkceyugu.cdn.bspapp.com/VKCEYUGU-weitao/e68dc1a0-a420-11ea-8a36-ebb87efcf8c0.png') no-repeat center / 100% 100%;
			padding-top: 100rpx;

			.swiper {
				height: 290rpx;
				width: 750rpx;
				// border-radius: 12rpx;
				overflow: hidden;

				// box-sizing: border-box;
				image {
					display: block;
					height: 290rpx;
					width: 706rpx;
					background-color: #000;
					margin: 0 auto;
					border-radius: 12rpx;
					overflow: hidden;
				}
			}
		}

		.page_bg {
			background-color: #f9f9f9;
			// border-radius: 48rpx 48rpx 0 0;
			// margin-top: -110rpx;
			// padding-top: 150rpx;
			padding-bottom: 20rpx;

			// box-sizing: border-box;
			.navigation_box {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-around;
				padding-top: 28rpx;
				background: url('https://vkceyugu.cdn.bspapp.com/VKCEYUGU-weitao/e67ad5e0-a420-11ea-8a36-ebb87efcf8c0.png') no-repeat center / 100% 100%;

				.navigation {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 20%;
					margin-bottom: 28rpx;
					font-size: 24rpx;
					color: #444;
					text-align: center;

					image {
						width: 100rpx;
						height: 100rpx;
						margin-bottom: 10rpx;
					}
				}
			}

			.mid-ad {
				text-align: center;
				// margin-bottom: 10rpx;
				width: 750rpx;
				height: 208rpx;
				background-color: #f9f9f9;

				image {
					width: inherit;
					height: inherit;
				}
			}

			.floor {
				// background-color: #ee8a52;
				background-color: #d84846;
				padding: 10rpx 0;

				.red_packets {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0 20rpx;
					box-sizing: border-box;

					image {
						height: 230rpx;
						width: 49%;
						border-radius: 18rpx;
						overflow: hidden;
					}
				}

				.mini_banner {
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					padding: 0 22rpx;
					margin-top: 24rpx;

					image {
						margin-bottom: 10rpx;
						border-radius: 12rpx;
						background-color: #b0f1ff;
					}

					.p4 {
						image {
							width: 49%;
							height: 186rpx;
						}
					}

					.p6 {
						image {
							width: 32.6%;
							height: 280rpx;
						}
					}
				}

				.card {
					position: relative;
					width: 706rpx;
					background-color: #ffffff;
					border-radius: 12rpx;
					margin: 20rpx auto;
					padding: 28rpx 20rpx 24rpx;
					overflow: hidden;

					.head {
						display: flex;
						align-items: center;

						.title {
							font-size: 38rpx;
							font-weight: bold;
							color: #2e2e2e;
						}

						.more {
							display: flex;
							align-items: center;
							margin-left: auto;
							font-size: 26rpx;
							color: #9c9c9c;
						}
					}
				}

				.zhongchou {
					color: rgb(51, 51, 51);

					.head,
					.fitem {
						position: relative;
						z-index: 2;
					}

					.tag {
						display: inline-block;
						width: 36rpx;
						height: 36rpx;
						border-radius: 4rpx;
						line-height: 36rpx;
						color: rgb(255, 255, 255);
						font-size: 22rpx;
						text-align: center;
						margin-right: 10rpx;
					}

					.fundingBg {
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 120rpx;
						border-radius: 12rpx 12rpx 0 0;
						z-index: 1;
					}

					.fitem {
						margin-top: 20rpx;

						.item {
							display: flex;
							justify-content: space-between;
							height: 264rpx;

							.desc {
								display: flex;
								flex-direction: column;

								.title {
									font-size: 30rpx;
									margin-top: 8rpx;
									white-space: pre-wrap;
									text-overflow: ellipsis;
									-webkit-line-clamp: 2;
									overflow: hidden;
								}

								.sub {
									max-width: 410rpx;
									font-size: 22rpx;
									color: rgb(125, 68, 2);
									margin-top: 10rpx;
									padding: 0 8rpx;
									background-color: rgb(255, 249, 227);
									border: 1rpx solid rgb(245, 235, 209);
									border-radius: 4rpx;
									overflow: hidden;
									white-space: nowrap;
									text-overflow: ellipsis;
								}

								.price {
									margin-top: 20rpx;
									font-size: 22rpx;
									color: rgb(254, 31, 29);
									font-weight: bold;
									font-family: 'AllAndNone';

									text:last-child {
										font-size: 28rpx;
									}
								}

								.count {
									margin-top: auto;

									image {
										width: 36rpx;
										height: 36rpx;
										border-radius: 4rpx;
										margin-right: 10rpx;
										vertical-align: bottom;
									}

									text {
										white-space: pre-wrap;
										font-size: 22rpx;
										line-height: 28rpx;
										margin-right: 2px;
									}

									.num {
										color: rgb(238, 136, 66);
									}
								}
							}

							.img {
								width: 264rpx;
								height: 264rpx;
							}
						}
					}

					.sitem {
						display: flex;
						justify-content: space-between;

						.item {
							margin-top: 20rpx;
							width: 48%;

							.title {
								font-size: 26rpx;
								white-space: nowrap;
								text-overflow: ellipsis;
								-webkit-line-clamp: 1;
								overflow: hidden;
							}

							.desc {
								display: flex;
								justify-content: space-between;
								margin-top: 10rpx;

								image {
									width: 150rpx;
									height: 150rpx;
								}

								.price {
									font-size: 22rpx;
									color: rgb(254, 31, 29);
									font-weight: bold;
									font-family: 'AllAndNone';

									text:last-child {
										font-size: 28rpx;
									}
								}
							}

							.count {
								image {
									width: 36rpx;
									height: 36rpx;
									border-radius: 4rpx;
									margin-right: 10rpx;
									vertical-align: bottom;
								}

								text {
									white-space: pre-wrap;
									font-size: 22rpx;
									line-height: 28rpx;
									margin-right: 2px;
								}

								.num {
									color: rgb(238, 136, 66);
								}
							}
						}
					}

					.progress {
						margin-top: 6rpx;
						height: 8rpx;
						border-radius: 4rpx;
						background-color: #eee;

						.complete {
							height: inherit;
							overflow: hidden;
							border-radius: 4rpx;

							.full-color {
								height: inherit;
								background-image: linear-gradient(to right, #ffc866, #ff581b);
							}
						}
					}

					.pro-fitem {
						width: 666rpx;
					}

					.pro-sitem {
						width: 320rpx;
					}
				}

				.haowu {
					.list {
						display: flex;
						justify-content: space-between;
						margin-top: 20rpx;

						.item {
							position: relative;
							width: 216rpx;
							height: 284rpx;
							background-color: #f7f7f7;
							border-radius: 12rpx;
							overflow: hidden;
							text-align: center;

							.goodsImg {
								width: 216rpx;
								height: 216rpx;
								// margin-top: 20rpx;
							}

							.paihangImg {
								width: 160rpx;
								height: 160rpx;
								margin-top: 40rpx;
							}

							.desc {
								position: absolute;
								bottom: 6rpx;
								width: 100%;
								text-align: center;
								font-size: 26rpx;
								color: #905a18;
								z-index: 2;

								view:last-child {
									font-size: 22rpx;
								}
							}

							.bg {
								position: absolute;
								bottom: 0;
								left: 0;
								width: 100%;
								height: 112rpx;
								z-index: 1;
							}

							.subTitle {
								position: absolute;
								top: 6rpx;
								left: 50%;
								transform: translateX(-50%);
								width: 80%;
								color: #fff;
								font-size: 24rpx;
								text-align: center;
								z-index: 2;
							}

							.paihangBg {
								height: 100%;
							}
						}
					}
				}

				.rexiao {
					padding: 28rpx 0 24rpx;

					.head {
						padding: 0 20rpx;

						.subTitle {
							align-self: flex-end;
							white-space: nowrap;
							font-size: 22rpx;
							color: rgb(153, 153, 153);
							margin-left: 10rpx;
							margin-bottom: 6rpx;
							max-width: 360rpx;
							text-overflow: ellipsis;
							overflow: hidden;
						}
					}

					scroll-view {
						white-space: nowrap;
						margin-top: 26rpx;

						.scoll-wrapper {
							display: flex;
							align-items: center;

							.goods {
								position: relative;
								width: 216rpx;
								height: 316rpx;
								margin-left: 20rpx;
								background: url(../../../static/LeaderboardBg.png) no-repeat center / 216rpx 316rpx;
								border-radius: 6rpx;

								// overflow: hidden;
								.labelImg {
									position: absolute;
									top: 0;
									left: 0;
									width: 44rpx;
									height: 48rpx;
								}

								.goodsImg {
									width: 216rpx;
									height: 216rpx;
								}

								.desc {
									white-space: pre-wrap;
									font-size: 22rpx;
									width: 174rpx;
									margin: 16rpx auto 0;
									text-align: center;
									text-overflow: ellipsis;
									color: rgb(125, 68, 2);
									-webkit-line-clamp: 2;
									overflow: hidden;
								}

								.label {
									white-space: nowrap;
									position: absolute;
									top: 194rpx;
									font-size: 20rpx;
									color: #fff;
									text-overflow: ellipsis;
									height: 32rpx;
									line-height: 32rpx;
									padding-left: 12rpx;
									padding-right: 12rpx;
									background-color: rgb(255, 90, 27);
									width: 216rpx;
									border-radius: 4rpx;
									overflow: hidden;
								}
							}
						}
					}
				}

				.miaosha {
					.head {
						.changci {
							font-size: 24rpx;
							color: #555;
							font-weight: bold;
							margin: 0 12rpx 0 24rpx;
						}

						.countDown {
							font-family: 'BebasNeue';
						}
					}

					scroll-view {
						white-space: nowrap;
						margin-top: 26rpx;

						.scoll-wrapper {
							display: flex;
							align-items: center;

							.goods {
								width: 185rpx;
								margin-left: 20rpx;

								/* background-color: #00C300 */
								image {
									width: 185rpx;
									height: 185rpx;
									border-radius: 6rpx;
									overflow: hidden;
									// background-color: #f7f7f7;
								}
							}

							.goods:first-child {
								margin-left: 0;
							}

							.price {
								font-size: 24rpx;
								color: rgb(254, 31, 29);
								font-family: 'AllAndNone';

								text:nth-child(1) {
									margin-left: 11rpx;
								}

								text:nth-child(2) {
									font-size: 28rpx;
									font-weight: 600;
									/* margin-left:2rpx; */
								}

								text:nth-child(3) {
									color: #9e9e9e;
									text-decoration: line-through;
									margin-left: 6rpx;
								}
							}
						}
					}
				}

				.channel {
					padding: 0 0 20rpx 0;
					display: flex;

					.item {
						width: 25%;
						text-align: center;

						.mainTitle,
						.subTitle {
							margin: 0 auto;
							white-space: nowrap;
							max-width: 140rpx;
							text-overflow: ellipsis;
							overflow: hidden;
						}

						.mainTitle {
							margin-top: 18rpx;
							font-size: 34rpx;
							color: rgb(51, 51, 51);
							// margin-left: 9px;
							font-weight: bold;
							height: 50rpx;
						}

						.subTitle {
							font-size: 22rpx;
							color: rgb(209, 148, 50);
							// margin-left: 9px;
							text-overflow: ellipsis;
							height: 34rpx;
						}

						image {
							width: 156rpx;
							height: 156rpx;
						}
					}
				}
			}

			.goodslist {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				padding: 0 20rpx;

				.item {
					position: relative;
					width: 346rpx;
					height: 506rpx;
					border-radius: 8rpx;
					background-color: #ffffff;
					margin-top: 24rpx;
					font-size: 28rpx;
					overflow: hidden;

					&>image:nth-child(1) {
						width: 346rpx;
						height: 346rpx;
						border-radius: 8rpx 8rpx 0 0;
					}

					&>image:nth-last-child(2) {
						position: absolute;
						bottom: 32rpx;
						right: 22rpx;
						width: 24rpx;
						height: 6rpx;
					}

					.labelbox {
						position: absolute;
						top: 308rpx;
						left: 0;

						text {
							display: inline-block;
							border-radius: 4rpx;
							// background-color: #d96b6c;
							color: #ffffff;
							margin-right: 10rpx;
							text-align: center;
							height: 32rpx;
							padding: 0 10rpx;
							line-height: 32rpx;
							font-size: 24rpx;
						}
					}

					.title,
					.subtitle {
						width: 346rpx;
						padding-left: 16rpx;
						padding-right: 6rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						-webkit-box-pack: center;
						overflow: hidden;
					}

					.title {
						font-size: 30rpx;
						color: rgb(51, 51, 51);
						line-height: 42rpx;
						margin-top: 6rpx;
					}

					.subtitle {
						font-size: 26rpx;
						color: rgb(153, 153, 153);
						margin-top: 4rpx;
						line-height: 36rpx;
					}

					.price {
						margin: 10rpx 0 0 16rpx;
						color: rgb(227, 13, 13);
						font-size: 26rpx;
						height: 40rpx;
						font-family: 'AllAndNone';

						.priceMin {
							font-size: 34rpx;
							margin-right: 4rpx;
							font-weight: bold;
						}

						.marketPrice {
							margin-left: 6rpx;
							font-size: 28rpx;
							color: rgb(153, 153, 153);
							text-decoration: line-through;
						}

						.spec {
							font-size: 24rpx;
						}
					}

					.menu {
						position: absolute;
						display: none;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						background-color: rgba(0, 0, 0, 0.6);
						z-index: 2;

						view {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 300rpx;
							height: 70rpx;
							margin: 16rpx auto;
							border-radius: 70rpx;
							background-color: #ffffff;
						}

						text {
							display: block;
							width: 140rpx;
							margin-left: 8rpx;
						}

						image {
							width: 32rpx;
							height: 32rpx;
						}
					}
				}
			}

			.goods_cat {
				// position: sticky;
				height: 122rpx;
				padding: 16rpx 0 6rpx;
				white-space: nowrap;
				z-index: 11;
				box-sizing: border-box;
				// transition: 0.4s;
				width: 750rpx;
				flex-direction: row;

				.box {
					display: flex;
					align-items: center;

					.detail {
						position: relative;
						width: 136rpx;
						height: 100rpx;
						text-align: center;

						&:nth-child(1) {
							margin-left: 20rpx;
						}

						view {
							transition: 0.1s;
						}

						view:nth-child(1) {
							width: 136rpx;
							height: 50rpx;
							line-height: 50rpx;
							font-size: 32rpx;
							color: #282828;
							font-weight: bold;
						}

						view:nth-child(2) {
							font-size: 24rpx;
							color: #999999;
						}

						&::before {
							position: absolute;
							left: 0;
							top: 50%;
							transform: translateY(-50%);
							content: '';
							display: block;
							width: 2rpx;
							height: 32rpx;
							background-color: #dddddd;
						}

						&:nth-child(1)::before {
							content: '';
							display: none;
						}

						&::after {
							position: absolute;
							display: none;
							bottom: 6rpx;
							left: 50%;
							transform: translate(-50%, 50%);
							content: '';
							height: 8rpx;
							width: 52rpx;
							border-radius: 8rpx;
							background: #c30d23;
						}
					}

					.active {
						view:nth-child(1) {
							font-size: 40rpx;
							color: #c30d23;
						}

						view:nth-child(2) {
							color: #c30d23;
						}

						&::after {
							display: block;
						}
					}
				}
			}
		}
	}
</style>