<template>
	<view
		class="mi-line-progress"
		:style="{
			borderRadius: round ? '100rpx' : 0,
			height: height + 'rpx',
			backgroundColor: inactiveColor
		}"
	>
		<view class="complete" :style="{ width: percent > 100 ? 100 : percent + '%' }"><view class="full-color"></view></view>
	</view>
</template>

<script>
/**
 * lineProgress 线型进度条
 * @description 展示操作或任务的当前进度，比如上传文件，是一个线形的进度条。
 * @property {String Number} percent 进度条百分比值，为数值类型，0-100
 * @property {Boolean} round 进度条两端是否为半圆（默认true）
 * @property {String} inactive-color 进度条的底色（默认#eee）
 * @property {String Number} height 进度条的高度，单位rpx（默认12）
 */
export default {
	name: 'mi-line-progress',
	props: {
		// 两端是否显示半圆形
		round: {
			type: Boolean,
			default: true
		},
		inactiveColor: {
			type: String,
			default: '#eee'
		},
		// 进度百分比，数值
		percent: {
			type: Number,
			default: 0
		},
		// 进度条的高度，单位rpx
		height: {
			type: [Number, String],
			default: 12
		},
	},
	data() {
		return {}
	},
	computed: {
	},
	methods: {}
}
</script>

<style lang="scss" scoped>
.mi-line-progress {
	.complete {
		height: inherit;
		overflow: hidden;
		border-radius: inherit;
		.full-color {
			height: inherit;
			background-image: linear-gradient(to right, #ffc866, #E73D49);
		}
	}
}
</style>
