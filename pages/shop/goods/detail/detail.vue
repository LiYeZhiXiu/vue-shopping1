<template>
	<view class="shop-detail">
		<!-- 首页轮播图片 -->
		<view class="detail-swiper">
			<swiper :autoplay="swiperAutoPlay" circular :interval="3000" :duration="200" @change="swiperChange"
				:current="swiperCurrent">
				<swiper-item v-if="swiperVideo.url !== ''" class="swiper-video">
					<video :src="swiperVideo.url" controls :enable-progress-gesture="false" :autoplay="false"
						id="swiper-video" @ended="videoEnd" @loadedmetadata="videoLoaded"
						@timeupdate="videoPlay"></video>
					<image :src="swiperVideo.poster" class="poster" v-show="showPoster"></image>
				</swiper-item>
				<swiper-item v-for="(item, index) in swiperImgs" :key="index">
					<image :src="item.url" mode="scaleToFill"></image>
				</swiper-item>
			</swiper>
			<!-- 自动播放获取视频时长 -->
			<view v-if="swiperVideo.url != ''" :style="{ opacity: playBtnOp, transition: '.5s' }">
				<view class="playBtn" @click="playVideo">
					<image src="/static/icon/play.png"></image>
					<text>{{ swiperVideo.duration.m + "'" }}{{ swiperVideo.duration.s + '"' }}</text>
				</view>
			</view>
			<!-- 轮播图指示器 -->
			<view class="count">
				<span>{{ swiperCurrent + 1 }}</span>
				<span>/</span>
				<span>{{ !swiperVideo.url ? swiperImgs.length : swiperImgs.length + 1 }}</span>
			</view>
		</view>
		<!-- 特卖汇 -->
		<view class="temaihui">
			<image src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-weitao/5206f860-8b04-11ea-b244-a9f5e5565f30.png">
			</image>
			<!-- 倒计时 -->
			<u-count-down class="countDown" :time="time" :show-days="false" color="#D61515" bg-color="#fff"
				font-size="26" height="32" separator-color="#fff"></u-count-down>
		</view>
		<!-- 价格与标题 -->
		<view class="price_title">
			<!-- 价格 -->
			<view class="priceBox">
				<view class="price">
					<text>￥</text>
					<text>{{ goodsInfo.price }}</text>
				</view>
				<text class="market_price"
					v-if="goodsInfo.price != goodsInfo.market_price">￥{{ goodsInfo.market_price }}</text>
				<text class="label"
					:style="{ backgroundColor: goodsInfo.label.attrs&&goodsInfo.label.attrs.bgColor }">{{ goodsInfo.label.text }}</text>
				<view class="like" @click="collectionGoods">
					<image src="/static/icon/detail_collect.png" v-if="!favorite"></image>
					<image src="/static/icon/detail_activeCollect.png" v-else></image>
				</view>
			</view>
			<!-- 标题区 -->
			<view class="goodsTitle">
				<view class="main">{{ goodsInfo.title }}</view>
				<view class="sub">{{ goodsInfo.summary }}</view>
				<view class="activity">{{ operation.wzl&&operation.wzl.staticWords }}</view>
				<view class="activity-entry" v-if="operation.wzl">{{ operation.wzl&&operation.wzl.hyperlinkWords }} >
				</view>
			</view>
		</view>
		<!-- 间隔 -->
		<u-gap height="16" bg-color="#f9f9f9"></u-gap>
		<!-- 功能区 -->
		<view class="function">
			<u-cell-group :border="false">
				<!-- 1 -->
				<u-cell @click="goodsPop = true,(functionType=='other')" :isLink="true">
					<view slot="title" class="listItem">
						<text class="subTitle">已选</text>
						<view class="selected-box">
							<text class="selected" v-for="(item, index) in selectedInfo.specSelected"
								:key="index">{{ item.name }}</text>
						</view>
						<text>x{{ selectedInfo.goodsCount }}</text>
					</view>
				</u-cell>
				<!-- 2 -->
				<u-cell @click="goodsPop = true,(functionType=='other')" :isLink="true">
					<view slot="title" class="listItem">
						<text class="subTitle">送至</text>
						<text>河南省 郑州市</text>
						<text class="isStock">有货</text>
					</view>
				</u-cell>
				<!-- 3 -->
				<u-cell @click="servicePop = true" :isLink="true">
					<view slot="title" class="listItem service">
						<text class="subTitle">服务</text>
						<view v-for="(item, index) in goodsInfo.services" :key="index" class="item">
							<image src="/static/icon/checkbox_check_hollowred.png"></image>
							<text>{{ item.text }}</text>
						</view>
					</view>
				</u-cell>
			</u-cell-group>
			<!-- 选择规格弹窗 -->
			<u-popup :show="goodsPop" @close="goodsPop = false" mode="bottom" round=12>
				<!-- 商品介绍 -->
				<view class="goodsInfo">
					<image :src="selectedInfo.goodsInfo.img" @click="previewImg(selectedInfo.goodsInfo.img)"></image>
					<view class="selectedInfo">
						<view class="price">
							<text>￥</text>
							<text>{{ goodsInfo.price }}</text>
						</view>
						<view class="selected">
							<text>已选：</text>
							<text v-for="(item, index) in selectedInfo.specSelected" :key="index">{{ item.name }}</text>
							<text>x{{ selectedInfo.goodsCount }}</text>
						</view>
					</view>
					<!-- 取消 -->
					<view class="goods-close">
						<u-icon class="close" color="#ccc" name="close-circle" size="28" @click="goodsPop = false">
						</u-icon>
					</view>
				</view>
				<!-- 商品属性 -->
				<scroll-view class="propBox" scroll-y :show-scrollbar="false">
					<view class="prop" v-for="(item, index) in specList" :key="index">
						<view class="attr">{{ item.name }}</view>
						<view class="value">
							<text v-for="(cItem, cIndex) in specChildList" v-if="cItem.pid === item.tid" :key="cIndex"
								:class="{ selected: cItem.selected }" @click="selectSpec(cIndex, cItem.pid)">
								{{ cItem.name }}
							</text>
						</view>
					</view>
					<view class="prop count">
						<view class="attr">数量</view>
						<u-number-box :value="selectedInfo.goodsCount" :max="9" :min="1" @change="addCount">
						</u-number-box>
					</view>
				</scroll-view>
				<!-- 按钮 -->
				<view class="btnBox" v-if="functionType=='other'">
					<view class="btn cart" @click="addCart">加入购物车</view>
					<view class="btn buy" @click="goBuy">立即购买</view>
				</view>
				<!-- 确认 -->
				<view class="confirm" v-if="functionType=='order'">
					<view class="btn" @click="goBuy">确认</view>
				</view>
				<view class="confirm" v-if="functionType=='cart'">
					<view class="btn" @click="addCart">确认</view>
				</view>
			</u-popup>
			<!-- 服务信息弹窗 -->
			<u-popup :show="servicePop" mode="bottom" @close="servicePop = false" round="12">
				<view class="title">
					说明
					<u-icon class="close" color="#777" name="close-circle" size="28" @click="servicePop = false">
					</u-icon>
				</view>
				<scroll-view scroll-y class="detail">
					<view class="serviceBox" v-for="(item, index) in servicesDetail.serviceList" :key="index">
						<view class="item">
							<image src="/static/icon/checkbox_check_hollowred.png"></image>
							<text>{{ item.name }}</text>
						</view>
						<view class="serviceDetail" v-for="(sitem, sindex) in item.descList" :key="sindex"
							:style="{ color: item.type == 'MERCHANT' ? '#9F8052' : '#777' }"
							@click="showQualification(item.type)">
							{{ sitem }}
						</view>
					</view>
				</scroll-view>
			</u-popup>
		</view>
		<!-- 间隔 -->
		<u-gap height="16" bg-color="#f9f9f9"></u-gap>
		<!-- 排行榜 -->
		<view class="rank u-flex">
			<image src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-weitao/82567ab0-abb4-11ea-8bd0-2998ac5bbf7e.png"
				style="width: 750rpx;height: 92rpx;">
			</image>
			<view class="text">
				<text>{{ compose.rank&&compose.rank.text || '暂未入榜' }}</text>
				<u-icon name="arrow-right" color="#C5C5C5"></u-icon>
			</view>
		</view>
		<!-- 间隔 -->
		<u-gap height="16" bg-color="#f9f9f9"></u-gap>
		<!-- 用户评价 -->
		<view class="comment card" v-if="comment.index">
			<view class="head">
				<view class="title">用户评价({{ comment.index.total_count }})</view>
				<view class="more" @click="goToMoreComment('__all__')">
					<text>{{ comment.index.positive_rate }}%满意</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
			<view class="tags">
				<text class="item" v-for="item in comment.index.tags" :key="item.id"
					@click="goToMoreComment(item.id)">{{ item.name }}({{ item.count }})</text>
			</view>
			<scroll-view scroll-x :show-scrollbar="false" enable-flex @scrolltolower="goToMoreComment('__all__')"
				:lower-threshold="0">
				<view class="scoll-wrapper">
					<view class="item" v-for="item in comment.content" :key="item.comment_id">
						<view class="user">
							<image :src="item.avatar || ''" mode="aspectFill"></image>
							<text class="name">{{ item.nick_name }}</text>
							<u-rate :count="5" :current="item.score" disabled size="24" active-color="#f1c158"></u-rate>
						</view>
						<view class="content u-line-2">{{ item.text }}</view>
					</view>
					<view class="more" @click="goToMoreComment('__all__')">
						<text>查看更多评价</text>
						<image src="/static/icon/arrow_right_circle.png"></image>
					</view>
					<view class="white"></view>
				</view>
			</scroll-view>
		</view>
		<!-- 间隔 -->
		<u-gap height="16" bg-color="#f9f9f9"></u-gap>
		<!-- 问大家 -->
		<view class="question card">
			<view v-if="compose.question&&compose.question.count" @click="goToMoreQuestion">
				<view class="head">
					<view class="title">问大家({{ compose.question.count || 0 }})</view>
					<view class="more">
						<image src="/static/icon/arrow-right.png"></image>
					</view>
				</view>
				<view class="list">
					<view class="item u-flex" v-for="item in compose.question.top" :key="item.ask_id">
						<image src="/static/icon/ask_question.png"></image>
						<text class="title u-line-1">{{ item.ask }}</text>
						<text class="count">{{ item.rcount }}个回答</text>
					</view>
				</view>
			</view>
			<view v-else style="padding: 20rpx;">
				<view class="head">
					<view class="title">暂无问答</view>
				</view>
				<view class="ask-empty u-flex">
					<image src="/static/icon/ask_list_empty.png"></image>
					<text>好不好，问大家</text>
					<view class="btn" @click="askQuestion">去提问</view>
				</view>
			</view>
		</view>
		<!-- 间隔 -->
		<u-gap height="16" bg-color="#f9f9f9"></u-gap>
		<!-- 为你推荐 -->
		<view class="swiper-goods" v-if="compose.swiperRecommend.length">
			<view class="head u-flex-col">
				<view class="title">为你推荐</view>
				<view class="underline"></view>
			</view>
			<swiper :indicator-dots="true" :autoplay="false" :interval="3000" :duration="200"
				indicator-active-color="#c7a26d" indicator-color="#eee" circular>
				<swiper-item v-for="(item, index) in compose.swiperRecommend" :key="index">
					<view class="goods">
						<view class="item" v-for="(sitem, sindex) in item" :key="sindex"
							@click="goToGoodsDetail(sitem.data.goods.gid)">
							<image class="goods-img" :src="sitem.data.goods.imgSquare" lazy-load />
							<view class="labelbox">
								<text v-for="(litem, lindex) in sitem.data.goods.labels" :key="lindex"
									:style="{ backgroundColor: litem.attrs.bgColor }">{{ litem.text }}</text>
							</view>
							<view class="title u-line-2">{{ sitem.data.goods.name }}</view>
							<view class="price">
								<text>￥</text>
								<text class="priceMin">{{ sitem.data.goods.priceMin / 100 }}</text>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 间隔 -->
		<u-gap height="16" bg-color="#f9f9f9"></u-gap>
		<!-- 商家信息 -->
		<view class="shop card">
			<view class="info u-flex">
				<image class="logo" :src="goodsInfo.brand.brandLogo" mode="aspectFit" lazy-load></image>
				<view class="name u-flex-col">
					<text class="main">{{ goodsInfo.brand.brandName }}</text>
					<image class="sub" :src="goodsInfo.brand.merchantLogo" mode="aspectFit" lazy-load></image>
				</view>
			</view>
			<view class="info_tab">
				<view class="info-item-content">
					<view class="item-tab fs">
						<text style="color: #000;">50万</text>
						<text style="color: #ccc;">粉丝人数</text>
					</view>
					<view class="item-tab shop">
						<text style="color: #000;">444</text>
						<text style="color: #ccc;">全部商品</text>
					</view>
				</view>
				<view class="grade u-flex">
					<view class="item">
						<text>商品描述</text>
						<text class="score"
							:style="{ color: compose.shopInfo.dsrInfo.product&&compose.shopInfo.dsrInfo.product.level == 'high' ? '#9f8052' : '#999' }">
							{{ compose.shopInfo.dsrInfo.product&&compose.shopInfo.dsrInfo.product.score }}
						</text>
						<text class="level" :style="{
										backgroundColor: compose.shopInfo.dsrInfo.product&&compose.shopInfo.dsrInfo.product.level == 'high' ? '#cf9e56' : '#ebebeb',
										color: compose.shopInfo.dsrInfo.product&&compose.shopInfo.dsrInfo.product.level == 'high' ? '#fff' : '#999'
									}">
							{{ compose.shopInfo.dsrInfo.product&&compose.shopInfo.dsrInfo.product.level | level }}
						</text>
					</view>
					<view class="item">
						<text>卖家服务</text>
						<text class="score"
							:style="{ color: compose.shopInfo.dsrInfo.product&&compose.shopInfo.dsrInfo.merchant.level == 'high' ? '#9f8052' : '#999' }">
							{{ compose.shopInfo.dsrInfo.product&&compose.shopInfo.dsrInfo.merchant.score }}
						</text>
						<text class="level" :style="{
										backgroundColor: compose.shopInfo.dsrInfo.product&&compose.shopInfo.dsrInfo.merchant.level == 'high' ? '#cf9e56' : '#ebebeb',
										color: compose.shopInfo.dsrInfo.product&&compose.shopInfo.dsrInfo.merchant.level == 'high' ? '#fff' : '#999'
									}">
							{{ compose.shopInfo.dsrInfo.product&&compose.shopInfo.dsrInfo.merchant.level | level }}
						</text>
					</view>
					<view class="item">
						<text>物流服务</text>
						<text class="score"
							:style="{ color: compose.shopInfo.dsrInfo.product&&compose.shopInfo.dsrInfo.delivery.level == 'high' ? '#9f8052' : '#999' }">
							{{ compose.shopInfo.dsrInfo.product&&compose.shopInfo.dsrInfo.delivery.score }}
						</text>
						<text class="level" :style="{
										backgroundColor: compose.shopInfo.dsrInfo.product&&compose.shopInfo.dsrInfo.delivery.level == 'high' ? '#cf9e56' : '#ebebeb',
										color: compose.shopInfo.dsrInfo.product&&compose.shopInfo.dsrInfo.delivery.level == 'high' ? '#fff' : '#999'
									}">
							{{ compose.shopInfo.dsrInfo.product&&compose.shopInfo.dsrInfo.delivery.level | level }}
						</text>
					</view>
				</view>
			</view>
			<view class="shop_btns mod_btns">
				<u-button class="btn" shape="circle" text="关注店铺"></u-button>
				<u-button class="btn" shape="circle" text="进入店铺" @click="goShop(goodsInfo.brand.jumpURL)"></u-button>
			</view>
		</view>
		<!-- 间隔 -->
		<u-gap height="16" bg-color="#f9f9f9"></u-gap>
		<!-- 底部图片分类 -->
		<u-tabs :list="goodsInfo.introExt" keyName="title" :scrollable="false" :current="introExtCurrent"
			@change="introExtChange" :bold="false" :inactiveStyle="{color:'#999'}" :activeStyle="{color:'#c7a26d'}"
			:font-size="26" :duration="0.2"></u-tabs>
		<!-- 详情图 -->
		<view class="detailImgs">
			<!-- 详情图列表 -->
			<image v-for="(item, index) in detailImgs" :key="index" :src="item" mode="widthFix" lazy-load
				@click="previewImg(item)"></image>
		</view>
		<!-- 底部菜单 -->
		<view class="bottom-menu">
			<view class="btns">
				<view class="btn" @click="navigateTo('../../../tabbar/home/home', 'tabbar')">
					<u-icon name="home" size="24"></u-icon>
					<text>首页</text>
				</view>
				<view class="btn">
					<button class="contact" open-type="contact">客服</button>
					<u-icon name="kefu-ermai" size="24"></u-icon>
					<text>客服</text>
				</view>
				<view class="btn" @click="navigateTo('../../../tabbar/cart/cart', 'tabbar')">
					<u-icon name="shopping-cart" size="24"></u-icon>
					<view class="nums" v-if="goNum">
						{{this.goNum>99?99:this.goNum}}
					</view>
					<view class="add" v-if="goNum">
						{{this.goNum>99?'+':''}}
					</view>
					<text>购物车</text>
				</view>
			</view>
			<view class="next">
				<view @click=";(goodsPop = true), (functionType = 'cart')">加入购物车</view>
				<view @click=";(goodsPop = true), (functionType = 'order')">立即购买</view>
			</view>
		</view>
		<!-- 加载中。。 -->
		<full-loading :show="fullLoading" bg-color="#fff"></full-loading>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import fullLoading from '@/components/full-loading.vue'
	export default {
		components: {
			fullLoading
		},
		filters: {
			level(lv) {
				if (lv == 'high') {
					return '高'
				} else if (lv == 'middle') {
					return '平'
				} else {
					return '低'
				}
			},
			scoreColor(lv) {
				if (lv == 'high') {
					return '#9f8052'
				} else {
					return '#999'
				}
			},
			levelColor() {
				if (lv == 'high') {
					return '#fff'
				} else {
					return '#999'
				}
			},
			levelBgColor() {
				if (lv == 'high') {
					return '#cf9e56'
				} else {
					return '#ebebeb'
				}
			}
		},
		data() {
			return {
				gid: 0,
				pid: 0,
				fullLoading: true,
				swiperCurrent: '',
				swiperImgs: [], //首页轮播图片
				swiperAutoPlay: false,
				showPoster: true,
				playBtnOp: 0,
				swiperVideo: { //视频
					url: "",
					duration: {
						m: '00',
						s: '00'
					},
					playing: false,
					poster: ''
				},
				goNum: 0,
				time: 1000 * 60,
				introExtCurrent: 0,
				goodsInfo: { //商品属性 价格/标题
					title: '',
					summary: '',
					price: '',
					market_price: '',
					label: '',
					services: [],
					brand: {},
					introExt: []
				},
				operation: {},
				compose: {
					shopInfo: {
						dsrInfo: {
							delivery: {
								level: 'high'
							},
							product: {
								level: 'high'
							},
							merchant: {
								level: 'high'
							}
						}
					},
					swiperRecommend: []
				},
				comment: {},
				servicesDetail: {},
				specList: [],
				specChildList: [],
				propTags: [],
				selectedInfo: { //选择信息
					goodsCount: 1,
					specSelected: [],
					goodsInfo: {}
				},
				detailImgs: [],
				servicePop: false,
				goodsPop: false,
				functionType: 'other'
			}
		},
		onLoad(e) {
			this.gid = parseInt(e.gid) || 138454;
			// 获取商品详情
			this.getGoodsDetail();
			this.showCart();
		},
		computed: {
			favorite() {
				if (this.favGoods.indexOf(this.gid) != -1) {
					return true
				} else {
					return false
				}
			},
			...mapState(['favGoods', 'isLogin', 'userInfo'])
		},
		onReady() {
			// 生成随机时间
			this.time = Math.floor(Math.random() * 25) * 1000
		},
		methods: {
			// 是否加入购物车
			showCart() {
				if (!this.userInfo.userName) return;
				uniCloud.callFunction({
					name: 'getCartGoodsId',
					data: {
						userName: this.userInfo.userName
					}
				}).then(res => {
					let data = res.result.data;
					data.map((item, index) => {
						if (item.gid == this.gid) {
							this.goNum = item.count;
						}
					});
				});
			},
			// 获取商品详情
			getGoodsDetail() {
				this.$u.api.getGoodsDetail({
					gid: this.gid
				}).then(res => {
					console.log(res);
					this.fullLoading = false;
					const goods = res.data.goods;
					this.pid = res.data.pid;
					// 处理轮播图和视频
					goods.carouselMapList.forEach(x => {
						// 图片
						if (x.type == 0) {
							this.swiperImgs.push(x)
						}
						// 视频
						else if (x.type == 1) {
							this.swiperVideo.url = x.url
						}
					});
					if (this.swiperVideo.url !== '') {
						this.videoContext = uni.createVideoContext('swiper-video', this)
						// 如果轮播图中有视频，则把轮播图的第一张图片作为视频封面。
						this.swiperVideo.poster = this.swiperImgs[0].url
						this.swiperImgs.splice(0, 1)
					}
					// 商品价格
					this.goodsInfo.price = goods.goodsInfo.priceMin / 100
					this.goodsInfo.market_price = goods.goodsInfo.marketPrice / 100
					// 标签
					if (goods.labels) {
						this.goodsInfo.label = goods.labels[0]
					}
					// 商品标题
					this.goodsInfo.title = goods.goodsInfo.name
					this.goodsInfo.summary = goods.goodsInfo.summary
					// 详情分类
					this.goodsInfo.introExt = goods.goodsInfo.introExt
					// 标题下活动
					this.operation = res.data.operation
					// 规格对应的商品
					this.productInfo = goods.productInfo;
					// 将获取到的商品规格重新组成新的数组
					if (goods.shopTags.length != 0) {
						const spec = goods.shopTags;
						spec.forEach(x => {
							this.specList.push({
								name: x.name,
								tid: x.tid
							});
						});
						spec.forEach(item => {
							item.tags.forEach(cItem => {
								this.specChildList.push({
									tid: cItem.tid,
									name: cItem.name,
									pid: cItem.parentId
								});
							});
						});
						// 规格 默认选中第一条
						this.specList.forEach(item => {
							for (let cItem of this.specChildList) {
								if (cItem.pid === item.tid) {
									this.$set(cItem, 'selected', true);
									this.selectedInfo.specSelected.push(cItem);
									break //forEach不能使用break
								}
							}
						});
						setTimeout(() => {
							this.queryGoodsInfo();
						}, 1000)
						// 规格对照表
						this.propTags = goods.propTags;
					} else {
						// 根据ID查询商品信息
						for (let x in this.productInfo) {
							if (x == goods.goodsInfo.pids[0]) {
								this.selectedInfo.goodsInfo = this.productInfo[x];
							}
						}
					}
					// 品牌d
					// console.log(goods.brand)
					this.goodsInfo.brand = goods.brand;
					// 服务信息
					for (let x in goods.services) {
						this.goodsInfo.services.push(goods.services[x]);
					}
					if (this.goodsInfo.services.length > 3) {
						this.goodsInfo.services.splice(3);
					}
					// 评价
					if (res.data.comment.content != null) {
						this.comment = res.data.comment;
						this.comment.index.tags.splice(0, 1);
						this.comment.index.tags.splice(4);
					}
					// 服务信息
					this.servicesDetail = res.data.serviceInfo;
					this.getCompose();
					// 获取详情页图片
					this.getDetailImgs();
				});
			},
			// 获取详情页图片
			getDetailImgs(index = 0) {
				this.detailImgs = [];
				const urlCheck = RegExp('^https://cdn');
				const result = urlCheck.test(this.goodsInfo.introExt[0].url);
				if (!result) {
					// 1 自营商品 2非自营
					let data = {
						gid: this.gid,
						title: this.goodsInfo.introExt[index] && this.goodsInfo.introExt[index].title,
						type: this.goodsInfo.brand.brandId == 11 ? 1 : 2
					}
					this.$u.api.detailImg(data).then(res => {
						if (res.code == 400004024) {
							uni.showToast({
								title: `获取商品详情图失败，请刷新重试`,
								icon: "none"
							});
						} else {
							res.rags.forEach(x => {
								if (x.editorName == 'pic_link_full_default_empty') {
									this.detailImgs.push(x.src);
								}
							});
						}
					});
				} else {
					let arr = this.goodsInfo.introExt[index].url.split('/');
					let param = arr[arr.length - 1].replace('html', 'json');
					let data = {
						type: 3,
						param
					}
					this.$u.api.detailImg(data).then(res => {
						res.data.forEach(x => {
							this.detailImgs.push(x.Img);
						});
					});
				}
			},
			// 更多模块信息
			getCompose() {
				this.$u.api.getGoodsCompose({
					gid: this.gid
				}).then(res => {
					// console.log(res[0].data)
					// 把商品列表数据分割成六个小数组，供轮播图使用
					if (res[0].data.recommendResponseList) {
						const goods = res[0].data.recommendResponseList;
						const length = goods.length;
						let arr = [];
						for (let i = 0; i < length / 6; i++) {
							arr.push(goods.splice(0, 6));
						}
						this.compose.swiperRecommend = arr;
					}
					this.compose.rank = res[1].data;
					this.compose.bottomRecommend = res[2].data.recommendResponseList;
					this.compose.shopInfo = res[3].data;
					// console.log(res[3].data);
					this.compose.question = res[5].data;
					this.compose.article = res[6].data.data;
				})
			},
			// 查询商品信息。由于商品信息返回比较复杂，所以这里处理也比较复杂。实际开发中先和后端约定好
			queryGoodsInfo() {
				if (this.selectedInfo.specSelected.length > 1) {
					// 找到相同属性的商品ID
					let propsArr = []
					this.selectedInfo.specSelected.forEach(x => {
						propsArr.push(this.propTags.filter(item => item.tid == x.tid));
					});
					let propsObj = {};
					propsArr.forEach(x => {
						x.forEach(z => {
							if (propsObj[z.pid]) {
								propsObj[z.pid]++;
							} else {
								propsObj[z.pid] = 1;
							}
						});
					});
					let goodsPid = 0;
					for (let x in propsObj) {
						if (propsObj[x] > 1) {
							goodsPid = x;
						}
					}
					// 根据ID查询商品信息
					for (let x in this.productInfo) {
						if (x == goodsPid) {
							this.selectedInfo.goodsInfo = this.productInfo[x];
						}
					}
				} else if (this.selectedInfo.specSelected.length == 1) {
					let propsArr = [];
					this.selectedInfo.specSelected.forEach(x => {
						propsArr.push(this.propTags.filter(item => item.tid == x.tid));
					});
					// 根据ID查询商品信息
					for (let x in this.productInfo) {
						if (x == propsArr[0][0].pid) {
							this.selectedInfo.goodsInfo = this.productInfo[x];
						}
					}
				}
			},
			// 查看商家资质
			showQualification(type) {
				if (type != 'MERCHANT') return
				this.previewImg(this.servicesDetail.qualificationPic)
			},
			// 查看更多评价
			goToMoreComment(id = '__all__') {
				uni.navigateTo({
					url: '../comment/comment?gid=' + this.gid + '&cid=' + id
				});
				console.log('../comment/comment?gid=' + this.gid + '&cid=' + id)
			},
			//切换图片分类
			introExtChange(e) {
				this.introExtCurrent = e.index;
				this.getDetailImgs(e.index)
			},
			// 预览大图
			previewImg(url) {
				if (typeof url == 'string') {
					url = url.split();
				}
				uni.previewImage({
					urls: url,
					fail() {
						uni.showToast({
							title: `图片预览失败，请稍后再试`,
							icon: "none"
						});
					}
				});
			},
			// 轮播图切换
			swiperChange(e) {
				this.swiperCurrent = e.detail.current
				if (this.swiperVideo.url !== '' && this.swiperVideo.playing == true) {
					if (e.detail.current != 0) {
						this.videoContext.pause()
					} else {
						this.videoContext.play()
					}
				}
			},
			// 播放视频
			playVideo() {
				this.swiperCurrent = 0
				this.swiperAutoPlay = false
				this.showPoster = false
				this.playBtnOp = 0
				this.videoContext.play()
			},
			// 当播放到末尾时触发
			videoEnd() {
				this.swiperAutoPlay = true
				this.showPoster = true
				this.playBtnOp = 1
			},
			// 视频元数据加载完成时触发
			videoLoaded(e) {
				const duration = parseInt(e.target.duration)
				this.swiperVideo.duration.m = parseInt(duration / 60)
					.toString()
					.padStart(2, '0')
				this.swiperVideo.duration.s = (duration % 60).toString().padStart(2, '0')
				this.playBtnOp = 1
			},
			// 播放进度变化时触发
			videoPlay(e) {
				if (e.detail.currentTime != 0) {
					this.swiperVideo.playing = true
				}
			},
			// 收藏商品
			collectionGoods() {
				let favGoods = this.favGoods;
				if (favGoods.length == 0) {
					this.$u.vuex('favGoods', [this.gid]);
					uni.showToast({
						title: "添加收藏成功",
						icon: "none"
					});
				} else {
					let index = favGoods.indexOf(this.gid);
					if (index == -1) {
						favGoods.unshift(this.gid);
						this.$u.vuex('favGoods', favGoods);
						uni.showToast({
							title: "添加收藏成功",
							icon: "none"
						});
					} else {
						favGoods.splice(index, 1);
						this.$u.vuex('favGoods', favGoods);
						uni.showToast({
							title: "添加收藏成功",
							icon: "none"
						});
					}
				}
			},
			// 修改商品数量
			addCount(e) {
				this.selectedInfo.goodsCount = e.value;
			},
			// 查看更多问答
			goToMoreQuestion() {
				uni.navigateTo({
					url: '../question/question?gid=' + this.gid
				});
			},
			// 跳转到店铺
			goShop(url) {
				uni.navigateTo({
					url: '../../../external/shop/shop?url=' + url.split("&")
				});
			},
			// 去回答问题
			askQuestion() {
				uni.showToast({
					title: '需要登录后才能发起提问~',
					icon: "none"
				});
			},
			// 
			nextStep(type) {
				if (!this.isLogin) {
					uni.navigateTo({
						url: '/pages/user/login/login'
					});
				}
				if (type == 'order') {
					this.goBuy()
				} else if (type == 'cart') {
					this.addCart()
				}
			},
			// 跳转其他一级界面
			navigateTo(url, type) {
				if (type == 'tabbar') {
					uni.switchTab({
						url: url
					})
				} else if (type == 'page') {
					this.subMenu = false
					uni.navigateTo({
						url: url
					})
				}
			},
			// 加入购物车
			addCart() {
				if (!this.userInfo.userName) {
					uni.navigateTo({
						url: '/pages/user/login/login'
					});
					return;
				}
				uni.showLoading({
					title: '加载中...'
				})
				const goods = {
					gid: this.selectedInfo.goodsInfo.gid,
					pid: this.selectedInfo.goodsInfo.pid,
					count: this.selectedInfo.goodsCount,
					checked: false
				}
				uniCloud.callFunction({
					name: 'addCart',
					data: {
						userName: this.userInfo.userName,
						goods
					},
					success: res => {
						uni.hideLoading();
						uni.showToast({
							title: `加入购物车成功`,
							icon: 'none',
						});
						this.goodsPop = false;
						this.goNum = this.selectedInfo.goodsCount;
					}
				});
			},
			// 购买
			goBuy(e) {
				uni.showToast({
					title: '购买',
					icon: "none"
				});
			}
		}
	}
</script>

<style lang="scss">
	.shop-detail {
		background-color: #f9f9f9;

		.detail-swiper {
			position: relative;

			swiper {
				height: 750rpx;

				.swiper-video {
					position: relative;

					video {
						width: 100%;
						height: 100%;
					}

					.poster {
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						z-index: 999;
					}
				}

				image {
					height: 100%;
					width: 100%;
				}
			}

			.playBtn {
				position: absolute;
				bottom: 40rpx;
				left: 50%;
				display: flex;
				align-items: center;
				transform: translateX(-50%);
				width: 168rpx;
				height: 60rpx;
				border-radius: 30rpx;
				background-color: rgba($color: #fff, $alpha: 0.6);
				font-size: 24rpx;

				image {
					width: 48rpx;
					height: 48rpx;
					min-width: 48rpx;
					margin: 0 18rpx 0 10rpx;
				}

				&:active {
					opacity: 0.8;
				}
			}

			.hide-video {
				position: absolute;
				left: 0;
				top: 0;
				z-index: -1;
			}

			.count {
				position: absolute;
				bottom: 54rpx;
				right: 0;
				padding: 0 10rpx;
				width: 80rpx;
				height: 36rpx;
				line-height: 36rpx;
				border-radius: 18rpx 0 0 18rpx;
				font-size: 20rpx;
				text-align: center;
				color: #ffffff;
				background-color: rgba(0, 0, 0, 0.2);
				font-family: 'AllAndNone';

				span:nth-child(1) {
					font-size: 26rpx;
					margin-left: 4rpx;
				}

				span:nth-child(2) {
					// font-size: 26rpx;
					margin: 0 4rpx;
				}
			}

			.back {
				position: fixed;
				top: 40rpx;
				left: 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 64rpx;
				height: 64rpx;
				font-size: 32rpx;
				color: #ffffff;
				border-radius: 50%;
				background-color: rgba(0, 0, 0, 0.3);
				z-index: 999;
			}
		}

		.temaihui {
			position: relative;
			height: 110rpx;
			background-color: #FFFFFF;

			image {
				width: 750rpx;
				height: 100%;
			}

			.countDown {
				position: absolute;
				bottom: 16rpx;
				right: 90rpx;
				font-family: 'BebasNeue';
			}
		}

		.price_title {
			background-color: #ffffff;
			padding: 20rpx 24rpx 16rpx;

			.priceBox {
				display: flex;
				margin-bottom: 16rpx;
				font-family: 'JDBold';

				.price {
					color: #d51010;
					font-weight: bold;
					font-size: 30rpx;

					text:nth-child(2) {
						font-size: 42rpx;
					}
				}

				.market_price {
					display: inline-block;
					margin: 18rpx 20rpx 0;
					font-size: 24rpx;
					color: #888;
					font-family: 'JDNormal';
					text-decoration: line-through;
				}

				.label {
					display: inline-block;
					margin-top: 18rpx;
					margin-left: 10rpx;
					padding: 0 8rpx;
					height: 32rpx;
					line-height: 32rpx;
					font-size: 22rpx;
					border-radius: 8rpx;
					color: #fff;
				}

				.like {
					margin-left: auto;

					image {
						height: 76rpx;
						width: 76rpx;
					}
				}
			}

			.goodsTitle {
				.main {
					font-size: 30rpx;
					font-weight: bold;
					color: #333;
				}

				.sub {
					color: #666;
				}

				.activity {
					color: #bf1111;
				}

				.activity,
				.sub {
					margin-top: 16rpx;
					font-size: 24rpx;
					// line-height: 36rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}

				.activity-entry {
					display: inline-block;
					padding: 4rpx 20rpx;
					margin: 10rpx 0 24rpx 0;
					font-size: 24rpx;
					color: #bf1111;
					border: 1rpx solid rgb(229, 203, 203);
					border-radius: 40rpx;
				}
			}
		}

		.function {
			position: relative;
			background-color: #FFFFFF;

			u-icon {
				color: #c5c5c5 !important;
				transform: translateX(10rpx) !important;
			}

			.listItem {
				font-size: 26rpx;
				display: flex;
				align-items: center;

				.selected-box {
					max-width: 560rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;

					.selected {
						margin-right: 8rpx;
					}
				}
			}

			.service {
				.item {
					display: flex;
					align-items: center;
					margin-right: 20rpx;

					image {
						width: 24rpx;
						height: 24rpx;
						min-width: 24rpx;
						margin-right: 6rpx;
					}

					text {
						font-size: 24rpx;
						color: #777;
					}
				}

				.item:last-child {
					max-width: 260rpx;

					text {
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
					}
				}
			}

			.subTitle {
				color: #777;
				font-size: 23rpx;
				margin-right: 20rpx;
				margin-left: -10rpx;
			}

			.selected {
				// font-weight: bold;
			}

			.isStock {
				color: #ff2e2e;
				margin-left: 16rpx;
			}

			.goodsInfo {
				position: relative;
				height: 300rpx;
				border-bottom: 1rpx solid #f3f3f3;
				display: flex;
				padding: 20rpx;
				align-items: center;

				.goods-close {
					position: absolute;
					right: 20rpx;
					top: 20rpx;
				}

				image {
					width: 300rpx;
					height: 300rpx;
					background-size: 100% 100%;
				}

				.selectedInfo {
					margin: 0rpx 20rpx;
					position: relative;

					.price {
						color: #ff5934;
						font-size: 40rpx;
						font-weight: 900;
					}

					.selected {
						color: #000;
						margin-top: 30rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}
				}
			}

			.propBox {
				height: 600rpx;

				.prop {
					padding: 0 20rpx;
					margin: 28rpx 0;

					.attr {
						font-size: 26rpx;
						color: #000;
						font-weight: bold;
					}

					.value {
						display: flex;
						flex-wrap: wrap;
						margin-top: 10rpx;

						text {
							background-color: #F5F5F5;
							min-width: 150rpx;
							box-sizing: border-box;
							height: 50rpx;
							padding: 10rpx 20rpx;
							text-align: center;
							margin: 0 10rpx 10rpx 0;
							overflow: visible;
							border-radius: 50rpx;
							border: 2rpx solid transparent;
							font-size: 24rpx;
						}

						.active {
							color: #f56600;
							border: 2prx solid #ff5934;
							background: rgba(255, 89, 52, 0.08);
						}
					}
				}

				.count {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
			}

			.btnBox {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 80rpx;
				background-color: #fff;
				z-index: 999;
				margin-bottom: 20rpx;

				.btn {
					width: 40%;
					height: 80rpx;
					color: #fff;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 30rpx
				}

				.cart {
					background-color: #FDA300;
					border-top-left-radius: 40rpx;
					border-bottom-left-radius: 40rpx;
				}

				.buy {
					background-color: #FE4502;
					border-top-right-radius: 40rpx;
					border-bottom-right-radius: 40rpx;
				}
			}

			.confirm {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 80rpx;
				background-color: #fff;
				z-index: 999;
				margin-bottom: 20rpx;

				.btn {
					width: 80%;
					height: 80rpx;
					background-color: #FDA300;
					border-radius: 80rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #fff;
					font-size: 30rpx;
				}
			}

			.title {
				position: relative;
				height: 88rpx;
				text-align: center;
				line-height: 88rpx;
				border-bottom: 1rpx solid #f3f3f3;

				.close {
					position: absolute;
					right: 48rpx;
					top: 50%;
					transform: translateY(-50%);
				}
			}

			.detail {
				height: 900rpx;

				.serviceBox {
					padding: 0 20rpx;
					margin: 28rpx 0;

					.item {
						display: flex;
						align-items: center;

						image {
							width: 24rpx;
							height: 24rpx;
							min-width: 24rpx;
							margin-right: 8rpx;
						}

						text {
							color: #444;
							font-size: 28rpx;
							line-height: 40rpx;
						}
					}

					.serviceDetail {
						color: #777;
						font-size: 22rpx;
						margin-top: 10rpx;
						padding-left: 30rpx;
					}
				}
			}


			.paramsBox {
				display: flex;
				align-items: center;
				height: 80rpx;
				padding: 0 30rpx;
				border-bottom: 1rpx solid #f8f8f8;

				.attr {
					color: #777;
					width: 160rpx;
				}
			}
		}

		.rank {
			position: relative;
			justify-content: space-between;
			width: 750rpx;
			height: 92rpx;
			// padding: 0 24rpx 0 210rpx;
			font-size: 28rpx;
			font-weight: bold;
			background-color: #ddd;

			image {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: inherit;
				z-index: 0;
			}

			.text {
				position: relative;
				width: 500rpx;
				height: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-left: 220rpx;
			}
		}

		.comment {
			width: 100%;
			padding: 20rpx;
			background-color: #FFFFFF;

			.head {
				width: 100%;
				height: 80rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 30rpx;
				color: #000;

				.title {
					font-weight: bold;
				}

				.more {
					display: flex;
					justify-content: space-between;
					align-items: center;
					color: #333333;

					text {
						margin-right: 20rpx;
					}
				}
			}

			.tags {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				padding: 0 26rpx;

				.item {
					display: inline-block;
					padding: 6rpx 12rpx;
					font-size: 22rpx;
					color: #444;
					background-color: rgb(244, 231, 206);
					border-radius: 30rpx;
					margin: 10rpx 12rpx 10rpx 0;

					&:active {
						opacity: 0.8;
					}
				}
			}

			scroll-view {
				margin: 20rpx 0;

				.scoll-wrapper {
					display: flex;
					align-items: center;
					flex-wrap: nowrap;
					padding: 0 26rpx;

					.item {
						padding: 30rpx 24rpx 0;
						margin-right: 32rpx;
						width: 616rpx;
						height: 226rpx;
						flex-shrink: 0;
						background-color: #fafafa;
						border-radius: 12rpx;
						border: 1px solid #111;

						.user {
							display: flex;
							align-items: center;

							image {
								width: 66rpx;
								height: 66rpx;
								border-radius: 33rpx;
							}

							.name {
								font-size: 26rpx;
								margin: 0 16rpx;
							}
						}

						.content {
							margin-top: 16rpx;
							font-size: 24rpx;
							color: #555;
							line-height: 48rpx;
						}
					}

					.more {
						display: flex;
						flex-direction: column;
						justify-content: center;
						padding: 0 40rpx;
						height: 226rpx;
						border-radius: 12rpx;
						background-color: #fafafa;
						line-height: 28rpx;
						color: #555;
						font-size: 24rpx;

						image {
							margin-top: 6rpx;
							width: 22rpx;
							height: 22rpx;
						}
					}

					.white {
						padding: 0 13rpx;
						height: 226rpx;
					}
				}
			}
		}

		.question {
			background-color: #FFFFFF;

			.list {
				padding: 0 26rpx;
				font-size: 24rpx;
				margin-top: 20rpx;

				.item {
					margin-bottom: 12rpx;

					image {
						width: 30rpx;
						height: 30rpx;
						min-width: 30rpx;
					}

					.title {
						margin-left: 12rpx;
						color: #444;
						max-width: 550rpx;
					}

					.count {
						margin-left: auto;
						color: #999;
					}
				}
			}

			.ask-empty {
				padding: 0 26rpx;
				font-size: 24rpx;
				height: 100rpx;

				image {
					width: 25rpx;
					height: 34rpx;
					margin-right: 10rpx;
				}

				.btn {
					margin-left: auto;
					height: 50rpx;
					width: 134rpx;
					line-height: 50rpx;
					text-align: center;
					color: rgb(159, 128, 82);
					border: 1rpx solid rgba(159, 128, 82, 0.6);
					border-radius: 25rpx;

					&:active {
						opacity: 0.8;
					}
				}
			}
		}

		.swiper-goods {
			padding: 30rpx 0 10rpx;
			background-color: #fff;

			.head {
				height: 60rpx;
				align-items: center;

				.title {
					font-size: 28rpx;
					color: rgb(159, 128, 82);
				}

				.underline {
					margin-top: 6rpx;
					width: 100rpx;
					height: 2rpx;
					border-radius: 1rpx;
					background-color: rgb(159, 128, 82);
				}
			}

			swiper {
				margin-top: 10rpx;
				height: 800rpx;
				width: 100%;

				.goods {
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					padding: 0 20rpx;

					.item {
						position: relative;
						width: 32%;
						border-radius: 8rpx;
						margin-bottom: 24rpx;
						font-size: 28rpx;
						overflow: hidden;

						.goods-img {
							width: 100%;
							height: 228rpx;
							background-color: #f8f8f8;
							border-radius: 8rpx 8rpx 0 0;
						}

						.labelbox {
							position: absolute;
							top: 192rpx;
							left: 0;

							text {
								display: inline-block;
								margin-right: 10rpx;
								padding: 0 10rpx;
								height: 28rpx;
								line-height: 28rpx;
								font-size: 22rpx;
								color: #ffffff;
								border-radius: 4rpx;
								text-align: center;
							}
						}

						.title {
							width: 100%;
							padding: 0 10rpx;
							height: 72rpx;
							font-size: 24rpx;
							color: rgb(51, 51, 51);
							line-height: 36rpx;
							margin-top: 6rpx;
						}

						.price {
							margin: 10rpx 0 0 10rpx;
							color: rgb(227, 13, 13);
							font-size: 24rpx;
							// height: 40rpx;
							font-family: 'AllAndNone';

							.priceMin {
								font-size: 28rpx;
							}
						}
					}
				}
			}
		}

		.shop {
			background-color: #FFFFFF;
			padding: 20rpx;

			.info {
				// margin: 20rpx 0 30rpx;
				// padding: 0 24rpx;
				width: 100%;
				font-size: 24rpx;
				height: 80rpx;
				display: flex;
				align-items: center;

				.logo {
					width: 80rpx;
					height: 80rpx;
					min-width: 80rpx;
					border-radius: 8rpx;
				}

				.name {
					margin-left: 20rpx;
					height: 80rpx;
					display: flex;
					align-items: center;

					.main {
						color: #555;
						font-size: 28rpx;
						white-space: nowrap;
					}

					.sub {
						margin-left: 20rpx;
					}
				}

				.go-to-shop {
					margin-left: auto;

					text {
						color: rgb(159, 128, 82);
					}

					image {
						width: 22rpx;
						height: 22rpx;
					}
				}
			}

			.info_tab {
				display: flex;
				align-items: center;

				.info-item-content {
					display: flex;
					justify-content: center;
					align-items: center;
					padding: 20rpx;
					font-size: 26rpx;

					.item-tab {
						display: flex;
						flex-direction: column;
						align-items: center;
						width: 240rpx;
					}

					.fs {
						border-right: 1px solid #ccc;
					}
				}

				.grade {
					margin-bottom: 20rpx;
					// padding: 0 24rpx;
					font-size: 24rpx;
					color: #999;
					flex: 1;

					.item {
						.score {
							margin: 0 8rpx;
						}

						.level {
							display: inline-block;
							padding: 0 4rpx;
							border-radius: 4rpx;
							background-color: blue;
						}
					}
				}
			}

			.shop_btns {
				display: flex;
				width: 600rpx;
				height: 80rpx;
				justify-content: space-between;
				align-items: center;
				margin: 0rpx auto;

				.btn {
					width: 250rpx;
					height: 80rpx;

				}
			}
		}

		.detailImgs {
			display: flex;
			flex-direction: column;
			min-height: 1000rpx;

			image {
				width: 100%;
			}
		}

		.bottom-menu {
			position: fixed;
			bottom: 0;
			width: 750rpx;
			height: 100rpx;
			display: flex;
			background-color: #fff;

			.btns {
				display: flex;
				font-size: 22rpx;

				.btn {
					width: 100rpx;
					height: 100rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					position: relative;

					.nums {
						position: absolute;
						right: 20rpx;
						top: 10rpx;
						width: 30rpx;
						height: 30rpx;
						background-color: red;
						color: #fff;
						font-size: 12rpx;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
					}

					.add {
						position: absolute;
						right: 10rpx;
						top: 0rpx;
						color: red;
					}

					&:active {
						background-color: #f2f3f4;
					}

					.contact {
						position: absolute;
						width: 100rpx;
						height: 100rpx;
						z-index: 1;
						opacity: 0;
					}
				}
			}

			.next {
				padding: 10rpx;
				display: flex;
				width: 450rpx;

				view {
					width: 50%;
					text-align: center;
					line-height: 80rpx;
					color: #fff;

					&:active {
						opacity: 0.8;
					}
				}

				view:first-child {
					background: linear-gradient(90deg, #ffd01e, #ff8917);
					border-radius: 40rpx 0 0 40rpx;
				}

				view:last-child {
					background: linear-gradient(90deg, #ff6034, #ee0a24);
					border-radius: 0 40rpx 40rpx 0;
				}
			}
		}
	}
</style>