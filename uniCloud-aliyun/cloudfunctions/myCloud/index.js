'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	let os = context.OS //客户端操作系统，返回值：android、ios    等
	let platform = context
		.PLATFORM //运行平台，返回值为 mp-weixin、app-plus等。注意：vue3版本uni-app将app-plus修改为了app，此处为保证旧版本兼容性未进行统一，推荐后续在业务中都使用app作为客户端标识
	let appid = context.APPID // manifest.json中配置的appid
	let deviceId = context.DEVICEID // 客户端标识，新增于HBuilderX 3.1.0，同uni-app客户端getSystemInfo接口获取的deviceId
	//event为客户端上传的参数
	console.log('event : ', event)
	try {
		let result = ''
		const collectionName = event.collectionName; //表的名字
		const queryWay = event.queryWay; //查询类型
		const screen = event.screen; //查询条件
		const screen2 = event.screen2;
		// 查询
		if (queryWay == 'find') {
			result = await db.collection(collectionName).where(screen).get();
		}
		// 数量
		if (queryWay == 'count') {
			result = await db.collection(collectionName).where(screen).get();
		}
		// 添加
		if (queryWay == 'add') {
			result = await db.collection(collectionName).add(screen);
		}
		// 修改
		if (queryWay == 'update') {
			result = await db.collection(collectionName).where(screen).update(screen2);
		}
		// 删除
		if (queryWay == 'delete') {
			result = await db.collection(collectionName).where(screen).remove();
		}
		//返回数据给客户端
		return result;
	} catch (e) {
		return {
			success: false,
			e: e
		}
	}
};
