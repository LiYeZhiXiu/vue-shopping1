<template>
	<view class="login-page">
		<!-- 手机号 -->
		<view class="input userName">
			<u-input placeholder="请输入用户名" border="bottom" v-model="userName" @change="getUName"></u-input>
		</view>
		<!-- 密码 -->
		<view class="input password">
			<u-input password placeholder="请输入密码" border="bottom" v-model="pword" @change="getPword"></u-input>
		</view>
		<!-- 登录 -->
		<view class="login">
			<view class="text" @click="login">登录/注册</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				userName: "",
				pword: ""
			}
		},
		computed: {
			...mapState(['isLogin'])
		},
		onLoad() {},
		methods: {
			getUName(value) {
				this.userName = value;
			},
			getPword(value) {
				this.pword = value;
			},
			// 登录
			login(e) {
				// 判断手机号是否为空
				if (this.userName == '') {
					uni.showToast({
						title: `用户名为空`,
						icon: 'none'
					});
				} else if (this.userName != '') {
                     uni.showLoading()
					if (this.pword == '') {
						uni.showToast({
							title: `密码为空`,
							icon: 'none'
						});
					} else {
						uniCloud.callFunction({
							name: 'myCloud',
							data: {
								collectionName: "userinfo",
								queryWay: "find",
								screen: {
									userName: this.userName,
								},
								screen2: {

								}
							}
						}).then(res => {
							let data1 = res.result.data;
							if (data1.length) {
								uniCloud.callFunction({
										name: 'myCloud',
										data: {
											collectionName: "userinfo",
											queryWay: "find",
											screen: {
												userName: this.userName,
												password: this.pword
											},
											screen2: {}
										}
									})
									.then(res2 => {
										let data2 = res2.result.data;
										uni.hideLoading()
										if (data2.length) {
											uni.navigateBack();
											this.$u.vuex('isLogin', true);
											this.$u.vuex('userInfo', {
												userName: this.userName
											});
										} else {
											uni.showToast({
												title: '密码有误！',
												icon: 'none'
											});
										}

									});
							} else {
								uniCloud.callFunction({
										name: 'myCloud',
										data: {
											collectionName: "userinfo",
											queryWay: "add",
											screen: {
												userName: this.userName,
												password: this.pword
											},
											screen2: {

											}
										}
									})
									.then(res2 => {
										uni.navigateBack();
										uni.hideLoading()
										this.$u.vuex('isLogin', true);
										this.$u.vuex('userInfo', {
											userName: this.userName
										});
									});
							}
						});
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.login-page {
		width: 100%;

		.input {
			padding: 20rpx 50rpx;
		}

		.login {
			padding: 50rpx 50rpx 0rpx 50rpx;
			width: 100%;
			// background-color: #2C405A;
			display: flex;
			justify-content: center;

			.text {
				background-color: #f10000;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				height: 80rpx;
				border-radius: 80rpx;
				color: #fff;
				font-size: 30rpx;
			}
		}
	}
</style>
