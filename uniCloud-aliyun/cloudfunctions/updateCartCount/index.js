'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const cartInDB = await db.collection('shopping_cart').where({
		userName: event.userName
	}).get()
	cartInDB.data[0].list.forEach(x=>{
		if (x.gid == event.goods.gid && x.pid == event.goods.pid) {
			x.count = event.goods.newCount
		}
	})
	let increaseCartCountResult = {}
	increaseCartCountResult = await db.collection('shopping_cart').doc(cartInDB.data[0]._id).update({
		list: cartInDB.data[0].list
	})
	if (increaseCartCountResult.updated == 1) {
		return {
			status: 0,
			msg: '修改数量成功'
		}
	}
	return {
		status: -1,
		msg: '修改数量失败，请稍后重试'
	}
};
