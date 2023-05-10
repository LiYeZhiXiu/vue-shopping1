<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			// 获取用户信息
			console.log()

		},
		onShow: function() {
			console.log('App Show')

		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*iconfont图标*/
	@import "./static/font/iconfont.css";
	/*每个页面公共css */
	@import "@/common/common.scss";
	/* uview样式 */
	@import "uview-ui/index.scss";
</style>