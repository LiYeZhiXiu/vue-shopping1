'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const cartInDB = await db.collection('shopping_cart').where({
		userName: event.userName
	}).get();
	let newList = cartInDB.data[0].list.filter(x => event.good.filter(y => y.gid == x.gid)[0]==x.gid);
	let increaseCartCountResult = {}
	increaseCartCountResult = await db.collection('shopping_cart').doc(cartInDB.data[0]._id).update({
		list: newList
	})
	if (increaseCartCountResult.updated == 1) {
		return {
			status: 0,
			msg: '删除商品成功'
		}
	}
	return {
		status: -1,
		msg: '删除商品失败，请稍后重试'
	}
};