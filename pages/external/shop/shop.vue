<template>
	<view>
		<web-view :src="goUrl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goUrl:''
			}
		},
		onLoad(e){
			// this.goUrl=e.url.split(",").join("&");
			
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
