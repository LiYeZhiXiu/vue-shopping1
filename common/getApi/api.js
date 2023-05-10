// /common/http.api.js

// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)
// let wxappLoginUrl = '/Wechatapplets/userInfo';

// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	// 此处没有使用传入的params参数
	// 获取首页数据
	let getHomeData = (params = {}) => vm.$http.get('/HomePage/homeData', params);

	// 按分类获取首页底部商品列表
	let getHomeFeeds = (params = {}) => vm.$http.get('/HomePage/feeds', params);
	
	// 每日上新
	let todayNew = (params = {}) => vm.$http.get('/HomePage/new', params);
	
	// 众筹
	let crowdfunding = (params = {}) => vm.$http.get('/HomePage/crowdfunding', params);

	// BEST
	let best100 = (params = {}) => vm.$http.get('/HomePage/best', params);
	
	// BEST商品列表
	let bestGoods = (params = {}) => vm.$http.post('/HomePage/bestGoods', params);
	
	// 总榜
	let topList = (params = {}) => vm.$http.get('/HomePage/topList', params);
	
	// 总榜商品列表
	let topGoodsList = (params = {}) => vm.$http.get('/HomePage/topGoodsList', params);
	
	// 秒杀
	let seckill = (params = {}) => vm.$http.get('/HomePage/seckill', params);
	
	// 直播
	let liveBroadcast = (params = {}) => vm.$http.get('/HomePage/live', params);
	
	// App首页数据
	let appHomeData = (params = {}) => vm.$http.get('/HomePage/appHomeData', params);
	
	
	/* 搜索相关 */
	// 搜索框占位词
	let placeHolder = (params = {}) => vm.$http.get('/Search/placeHolder', params);
	
	// 获取搜索热词
	let hotWords = (params = {}) => vm.$http.get('/Search/hotWords', params);
	
	// 获取搜索推荐关键词
	let searchSuggest = (params = {}) => vm.$http.get('/Search/suggest', params);
	
	
	/* 分类相关 */
	// 获取一级分类列表
	let firstCategory = (params = {}) => vm.$http.get('/Category/list', params);

	// 获取二级分类列表
	let categoryDetail = (params = {}) => vm.$http.get('/Category/detail', params);

	/* 生活相关 */
	// 生活首页数据
	let lifeHomePage = (params = {}) => vm.$http.get('/Life/bktrSimple', params);

	// 获取分栏内容
	let lifeTabsContent = (params = {}) => vm.$http.get('/Life/getHomeTab', params);

	// 获取文章详情
	let articleDetail = (params = {}) => vm.$http.get('/Life/detail', params);

	// 文章详情推荐文章 
	let articleRecommend = (params = {}) => vm.$http.get('/Life/getSimilarFeed', params);
	
	/* 商品相关 */
	
	// 搜索获取商品列表
	let doSearch = (params = {}) => vm.$http.post('/Goods/doSearch', params);
	
	// 分类获取商品列表
	let queryIdSearch = (params = {}) => vm.$http.post('/Goods/queryIdSearch', params);
	
	// 根据ID查询商品
	let queryByGids = (params = {}) => vm.$http.post('/Goods/queryByGids', params);

	/**
	 * 推荐商品
	 * @param type 1全部订单推荐商品
	 * @param type 2待付款订单推荐商品
	 * @param type 3待收货订单推荐商品
	 * @param type 4已收货订单推荐商品
	 * @param type 5退款订单推荐商品
	 * @param type 6收藏夹推荐商品
	 * @param type 7购物车推荐商品
	 * @param type 8可用优惠券推荐商品
	 * @param type 9不可用优惠券推荐商品
	 */
	let getRecommendGoods = (params = {}) => vm.$http.get('/Goods/recommend', params);
	
	// 获取商品详情
	let getGoodsDetail = (params = {}) => vm.$http.get('/Goods/detail', params);
	
	// 获取商品更多信息
	let getGoodsCompose = (params = {}) => vm.$http.get('/Goods/composeTwo', params);
	
	// 获取商品评价标签
	let commentTag = (params = {}) => vm.$http.get('/Goods/commentTag', params);
	
	// 获取评价列表
	let commentContent = (params = {}) => vm.$http.get('/Goods/commentContent', params);
	
	// 获取问答列表
	let askInfo = (params = {}) => vm.$http.get('/Goods/askInfo', params);
	
	// 商品详情图
	let detailImg = (params = {}) => vm.$http.get('/Goods/detailImg', params);
	
	
	
	/* 用户相关 */
	// 获取更新日志
	let updateHistory = (params = {}) => vm.$http.get('/User/updateHistory', params);
	
	// 获取可用优惠券数量
	let couponCount = (params = {}) => vm.$http.get('/User/couponCount', params);
	
	// 获取用户优惠券列表
	let couponList = (params = {}) => vm.$http.get('/User/coupon', params);

	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {
		getHomeData,
		placeHolder,
		hotWords,
		todayNew,
		crowdfunding,
		best100,
		bestGoods,
		topList,
		topGoodsList,
		seckill,
		liveBroadcast,
		appHomeData,
		searchSuggest,
		getHomeFeeds,
		firstCategory,
		categoryDetail,
		lifeHomePage,
		lifeTabsContent,
		articleDetail,
		articleRecommend,
		getRecommendGoods,
		doSearch,
		queryIdSearch,
		queryByGids,
		getGoodsDetail,
		getGoodsCompose,
		commentTag,
		commentContent,
		askInfo,
		detailImg,
		updateHistory,
		couponCount,
		couponList
	};
}

export default {
	install
}
