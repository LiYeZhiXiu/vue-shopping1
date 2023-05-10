import operate from '../common/operate.js'
// vuex 的使用  详情参考官网 https://uniapp.dcloud.io/vue-vuex
import store from '../store/index.js'

export default class Request {
	http(param) {
		// console.log(param)
		// 请求参数
		var url = param.url,
			method = param.method,
			header = {},
			data = param.data || {},
			token = param.token || "",
			hideLoading = param.hideLoading || false;

		//拼接完整请求地址
		var requestUrl = url;

		//请求方式:GET或POST(POST需配置
		// header: {'content-type' : "application/x-www-form-urlencoded"},)
		if (method) {
			method = method.toUpperCase(); //小写改为大写
			if (method == "POST") {
				header = {
					'content-type': "application/x-www-form-urlencoded"
				};
			} else {
				header = {
					'content-type': "application/json"
				};
			}
		}

		//加载圈
		if (!hideLoading) {
			// uni.showLoading({
			//     title: '加载中...'
			// });
		}

		// 返回promise
		return new Promise((resolve, reject) => {
			// 请求
			uni.request({
				url: requestUrl,
				data: data,
				method: method,
				header: header,
				success: (res) => {
					// 判断 请求api 格式是否正确
					if (res.statusCode && res.statusCode == 200) {
						resolve(res.data)
						return;
					} else {
					 uni.showToast({
							title: "code!=200" + res.data.msg,
							icon: 'none'
						});
						return;
					}
				},
				//请求失败
				fail: (e) => {
					uni.showToast({
						title: "" + e.data.msg,
						icon: 'none'
					});
					resolve("请求失败");
				},
				//请求完成
				complete() {
					//隐藏加载
					if (!hideLoading) {
						// uni.hideLoading();
					}
					resolve();
					return;
				}
			})
		})
	}
}
